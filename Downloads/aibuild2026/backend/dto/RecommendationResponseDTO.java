package dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResponseDTO {
    private Long id;
    
    @JsonProperty("product_id")
    private Long productId;
    
    @JsonProperty("product_name")
    private String productName;
    
    private String location;
    
    @JsonProperty("demand_forecast")
    private Double demandForecast;
    
    @JsonProperty("recommended_reorder")
    private Double recommendedReorder;
    
    @JsonProperty("inventory_gap")
    private Double inventoryGap;
    
    @JsonProperty("max_capacity")
    private Double maxCapacity;
    
    @JsonProperty("capacity_gap")
    private Double capacityGap;
    
    @JsonProperty("bottleneck_detected")
    private Boolean bottleneckDetected;
    
    @JsonProperty("total_estimated_cost")
    private Double totalEstimatedCost;
    
    @JsonProperty("sla_score")
    private Double slaScore;
    
    @JsonProperty("sla_penalty_risk")
    private Double slaPenaltyRisk;
    
    @JsonProperty("negotiation_score")
    private Double negotiationScore;
    
    @JsonProperty("resolution_strategy")
    private String resolutionStrategy;
    
    // Planner Plan
    private Map<String, Object> plan;
    
    // Simulation Scenarios
    private List<Map<String, Object>> scenarios;
    
    @JsonProperty("best_scenario")
    private String bestScenario;
    
    // Explainability Agent Natural Text
    private String explanation;
    
    // Agent Trace Logs
    private List<Map<String, Object>> logs;
}
