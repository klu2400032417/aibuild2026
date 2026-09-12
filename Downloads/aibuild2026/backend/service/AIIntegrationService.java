package service;

import dto.RecommendationResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class AIIntegrationService {

    private final RestTemplate restTemplate;

    @Value("${ai.engine.url:http://localhost:8000}")
    private String aiEngineUrl;

    public AIIntegrationService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public RecommendationResponseDTO getRecommendation(Map<String, Object> requestPayload) {
        String url = aiEngineUrl + "/api/v1/recommend";
        try {
            return restTemplate.postForObject(url, requestPayload, RecommendationResponseDTO.class);
        } catch (Exception e) {
            System.err.println("Warning: AI Engine unavailable. Executing offline fallback calculation: " + e.getMessage());
            return getFallbackResponse(requestPayload);
        }
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getAgentLogs() {
        String url = aiEngineUrl + "/api/v1/agent-status";
        try {
            return restTemplate.getForObject(url, List.class);
        } catch (Exception e) {
            System.err.println("Warning: AI Engine offline. Returning empty status trace.");
            return Collections.emptyList();
        }
    }

    private RecommendationResponseDTO getFallbackResponse(Map<String, Object> payload) {
        // Build mock/fallback calculation in case Python is not running
        Long productId = Long.valueOf(String.valueOf(payload.getOrDefault("product_id", "1")));
        String productName = String.valueOf(payload.getOrDefault("product_name", "Mock Product"));
        Double histSales = Double.valueOf(String.valueOf(payload.getOrDefault("historical_sales", "120.0")));
        Double currentStock = Double.valueOf(String.valueOf(payload.getOrDefault("current_stock", "40.0")));
        Double unitCost = Double.valueOf(String.valueOf(payload.getOrDefault("unit_cost", "15.0")));
        
        Double forecast = histSales * 1.05;
        Double reorder = Math.max(0.0, forecast + 20 - currentStock);
        Double totalCost = reorder * unitCost + 250.0;
        Double sla = 95.0;

        RecommendationResponseDTO fallback = new RecommendationResponseDTO();
        fallback.setProductId(productId);
        fallback.setProductName(productName);
        fallback.setLocation(String.valueOf(payload.getOrDefault("location", "Store")));
        fallback.setDemandForecast(forecast);
        fallback.setRecommendedReorder(reorder);
        fallback.setInventoryGap(Math.max(0.0, forecast - currentStock));
        fallback.setMaxCapacity(200.0);
        fallback.setCapacityGap(0.0);
        fallback.setBottleneckDetected(false);
        fallback.setTotalEstimatedCost(totalCost);
        fallback.setSlaScore(sla);
        fallback.setSlaPenaltyRisk(0.0);
        fallback.setNegotiationScore(88.5);
        fallback.setResolutionStrategy("STANDARD_FALLBACK");

        Map<String, Object> plan = new HashMap<>();
        plan.put("production_run_qty", reorder);
        plan.put("procurement_qty", 0.0);
        plan.put("priority", "MEDIUM");
        plan.put("distribution_route", "Standard Fallback Roadway");
        plan.put("bottlenecks", Arrays.asList("AI Engine Connection Failed (Offline Mode)"));
        plan.put("notes", "This is an offline fallback recommendation because the AI engine was unavailable.");
        fallback.setPlan(plan);

        // Simulation scenarios
        List<Map<String, Object>> scenarios = new ArrayList<>();
        Map<String, Object> sc1 = new HashMap<>();
        sc1.put("scenario_name", "Base Plan");
        sc1.put("demand", forecast);
        sc1.put("capacity", 200.0);
        sc1.put("cost", totalCost);
        sc1.put("sla_score", sla);
        sc1.put("stockout_risk", "Low");
        sc1.put("score", 90.0);
        scenarios.add(sc1);

        Map<String, Object> sc2 = new HashMap<>();
        sc2.put("scenario_name", "Supply Disruption");
        sc2.put("demand", forecast);
        sc2.put("capacity", 100.0);
        sc2.put("cost", totalCost * 1.5);
        sc2.put("sla_score", 50.0);
        sc2.put("stockout_risk", "High");
        sc2.put("score", 45.0);
        scenarios.add(sc2);

        fallback.setScenarios(scenarios);
        fallback.setBestScenario("Base Plan");
        fallback.setExplanation("### Offline Rationale\nFulfilling standard reorder targets based on basic deterministic inventory policies. Connection to the multi-agent AI Engine was offline.");
        
        List<Map<String, Object>> logs = new ArrayList<>();
        Map<String, Object> log = new HashMap<>();
        log.put("timestamp", new Date().toString());
        log.put("agent", "System");
        log.put("status", "WARNING");
        log.put("message", "AI Engine is offline. Fallback recommendation service engaged.");
        logs.add(log);
        fallback.setLogs(logs);

        return fallback;
    }
}
