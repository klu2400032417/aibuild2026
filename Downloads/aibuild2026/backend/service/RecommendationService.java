package service;

import dto.RecommendationRequestDTO;
import dto.RecommendationResponseDTO;
import entity.DemandForecast;
import entity.Inventory;
import entity.Recommendation;
import entity.SimulationScenario;
import repository.DemandForecastRepository;
import repository.RecommendationRepository;
import repository.SimulationScenarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final InventoryService inventoryService;
    private final AIIntegrationService aiIntegrationService;
    private final RecommendationRepository recommendationRepository;
    private final SimulationScenarioRepository simulationScenarioRepository;
    private final DemandForecastRepository demandForecastRepository;

    public RecommendationService(InventoryService inventoryService,
                                 AIIntegrationService aiIntegrationService,
                                 RecommendationRepository recommendationRepository,
                                 SimulationScenarioRepository simulationScenarioRepository,
                                 DemandForecastRepository demandForecastRepository) {
        this.inventoryService = inventoryService;
        this.aiIntegrationService = aiIntegrationService;
        this.recommendationRepository = recommendationRepository;
        this.simulationScenarioRepository = simulationScenarioRepository;
        this.demandForecastRepository = demandForecastRepository;
    }

    @Transactional
    public RecommendationResponseDTO generateRecommendation(RecommendationRequestDTO request) {
        // Fetch inventory parameters
        Inventory item = inventoryService.getInventoryById(request.getProductId());

        // Find the location with the highest surplus (currentStock - safetyStock) of this product to pull stock from
        Inventory sourceItem = inventoryService.getAllInventory().stream()
                .filter(i -> i.getProductName().equalsIgnoreCase(item.getProductName()) && !i.getId().equals(item.getId()))
                .filter(i -> (i.getCurrentStock() - i.getSafetyStock()) > 0)
                .max((i1, i2) -> Double.compare(i1.getCurrentStock() - i1.getSafetyStock(), i2.getCurrentStock() - i2.getSafetyStock()))
                .orElse(null);

        String sourceLocation = sourceItem != null ? sourceItem.getLocation() : "External Supplier";
        Double sourceSurplus = sourceItem != null ? (sourceItem.getCurrentStock() - sourceItem.getSafetyStock()) : 9999.0;

        // Prepare context dictionary for AI Engine
        Map<String, Object> payload = new HashMap<>();
        payload.put("product_id", item.getId());
        payload.put("product_name", item.getProductName());
        payload.put("location", item.getLocation() != null ? item.getLocation() : "Store");
        payload.put("source_location", sourceLocation);
        payload.put("source_surplus", sourceSurplus);
        payload.put("historical_sales", request.getHistoricalSales());
        payload.put("season_index", request.getSeasonIndex());
        payload.put("price", request.getPrice());
        payload.put("promo_active", request.getPromoActive());
        payload.put("current_stock", item.getCurrentStock());
        payload.put("lead_time_days", item.getLeadTimeDays());
        payload.put("safety_stock", item.getSafetyStock());
        payload.put("max_capacity", item.getMaxCapacity());
        payload.put("unit_cost", item.getUnitCost());
        payload.put("holding_cost", item.getHoldingCost());
        payload.put("shipping_cost", 250.0); // Fixed standard shipping
        payload.put("target_delivery_days", 10);
        payload.put("sla_penalty_rate", 50.0);

        // Fetch recommendations from AI Integration Service
        RecommendationResponseDTO response = aiIntegrationService.getRecommendation(payload);
        response.setLocation(item.getLocation());

        // Persist Recommendation
        Recommendation rec = Recommendation.builder()
                .productId(item.getId())
                .productName(item.getProductName())
                .demandForecast(response.getDemandForecast())
                .recommendedReorder(response.getRecommendedReorder())
                .totalEstimatedCost(response.getTotalEstimatedCost())
                .slaScore(response.getSlaScore())
                .resolutionStrategy(response.getResolutionStrategy())
                .distributionRoute(sourceLocation) // Save the source location as the distribution route
                .explanation(response.getExplanation())
                .build();
        Recommendation savedRec = recommendationRepository.save(rec);
        response.setId(savedRec.getId());

        // Persist Simulation Scenarios
        if (response.getScenarios() != null) {
            List<SimulationScenario> scenarios = response.getScenarios().stream().map(s -> 
                SimulationScenario.builder()
                    .recommendationId(savedRec.getId())
                    .scenarioName(String.valueOf(s.get("scenario_name")))
                    .demand(Double.valueOf(String.valueOf(s.get("demand"))))
                    .capacity(Double.valueOf(String.valueOf(s.get("capacity"))))
                    .cost(Double.valueOf(String.valueOf(s.get("cost"))))
                    .slaScore(Double.valueOf(String.valueOf(s.get("sla_score"))))
                    .stockoutRisk(String.valueOf(s.get("stockout_risk")))
                    .score(Double.valueOf(String.valueOf(s.get("score"))))
                    .build()
            ).collect(Collectors.toList());
            simulationScenarioRepository.saveAll(scenarios);
        }

        // Persist Demand Forecast Entry
        DemandForecast forecastEntry = DemandForecast.builder()
                .productId(item.getId())
                .productName(item.getProductName())
                .forecastedDemand(response.getDemandForecast())
                .historicalSales(request.getHistoricalSales())
                .seasonIndex(request.getSeasonIndex())
                .price(request.getPrice())
                .promoActive(request.getPromoActive() == 1)
                .build();
        demandForecastRepository.save(forecastEntry);

        return response;
    }

    public List<Recommendation> getRecentRecommendations(Long productId) {
        return recommendationRepository.findByProductIdOrderByRecommendationDateDesc(productId);
    }

    @Transactional
    public Recommendation approveRecommendation(Long id) {
        Recommendation rec = recommendationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recommendation not found"));
        
        rec.setResolutionStrategy("APPROVED");
        Recommendation saved = recommendationRepository.save(rec);
        
        Inventory storeItem = inventoryService.getInventoryById(rec.getProductId());
        List<Inventory> whItems = inventoryService.getAllInventory().stream()
                .filter(i -> i.getProductName().equalsIgnoreCase(storeItem.getProductName()) && i.getLocation().equalsIgnoreCase(rec.getDistributionRoute()))
                .toList();
                
        if (!whItems.isEmpty() && storeItem.getLocation().toLowerCase().contains("store")) {
            Inventory whItem = whItems.get(0);
            double qty = rec.getRecommendedReorder();
            
            whItem.setCurrentStock(Math.max(0.0, whItem.getCurrentStock() - qty));
            storeItem.setCurrentStock(storeItem.getCurrentStock() + qty);
            
            inventoryService.createOrUpdateInventory(whItem);
            inventoryService.createOrUpdateInventory(storeItem);
            
            System.out.println("SUCCESS: Executed stock transfer of " + qty + " units of " + storeItem.getProductName() + 
                    " from " + whItem.getLocation() + " to " + storeItem.getLocation());
        }
        
        return saved;
    }
}
