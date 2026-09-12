package dto;

import entity.Recommendation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    private Long totalProducts;
    private Double totalCosts;
    private Double averageSlaScore;
    private Long stockoutAlerts;
    private List<Recommendation> recentRecommendations;
    private List<Map<String, Object>> agentStatusLogs;
}
