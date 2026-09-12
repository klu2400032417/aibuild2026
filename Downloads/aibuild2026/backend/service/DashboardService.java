package service;

import dto.DashboardDTO;
import entity.Inventory;
import entity.Recommendation;
import repository.InventoryRepository;
import repository.RecommendationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final InventoryRepository inventoryRepository;
    private final RecommendationRepository recommendationRepository;
    private final AIIntegrationService aiIntegrationService;

    public DashboardService(InventoryRepository inventoryRepository,
                            RecommendationRepository recommendationRepository,
                            AIIntegrationService aiIntegrationService) {
        this.inventoryRepository = inventoryRepository;
        this.recommendationRepository = recommendationRepository;
        this.aiIntegrationService = aiIntegrationService;
    }

    public DashboardDTO getDashboardData() {
        // 1. Get total products
        long totalProducts = inventoryRepository.count();

        // 2. Calculate stockout alerts (current_stock < safety_stock)
        List<Inventory> inventoryList = inventoryRepository.findAll();
        long stockoutAlerts = inventoryList.stream()
                .filter(i -> i.getCurrentStock() < i.getSafetyStock())
                .count();

        // 3. Get recent recommendations
        List<Recommendation> recentRecs = recommendationRepository.findAll();
        
        // Take latest 5
        List<Recommendation> limitedRecs = recentRecs.stream()
                .sorted((r1, r2) -> r2.getRecommendationDate().compareTo(r1.getRecommendationDate()))
                .limit(5)
                .toList();

        // 4. Calculate total costs and average SLA
        double totalCost = recentRecs.stream()
                .filter(r -> r.getTotalEstimatedCost() != null)
                .mapToDouble(Recommendation::getTotalEstimatedCost)
                .sum();
        double avgSla = recentRecs.stream()
                .filter(r -> r.getSlaScore() != null)
                .mapToDouble(Recommendation::getSlaScore)
                .average()
                .orElse(100.0);

        // 5. Get current agent trace logs from FastAPI
        List<Map<String, Object>> agentLogs = aiIntegrationService.getAgentLogs();

        return new DashboardDTO(
                totalProducts,
                totalCost,
                avgSla,
                stockoutAlerts,
                limitedRecs,
                agentLogs
        );
    }
}
