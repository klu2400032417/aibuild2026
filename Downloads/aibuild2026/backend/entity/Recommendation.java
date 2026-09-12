package entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recommendation")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "demand_forecast")
    private Double demandForecast;

    @Column(name = "recommended_reorder")
    private Double recommendedReorder;

    @Column(name = "total_estimated_cost")
    private Double totalEstimatedCost;

    @Column(name = "sla_score")
    private Double slaScore;

    @Column(name = "resolution_strategy")
    private String resolutionStrategy;

    @Column(name = "distribution_route")
    private String distributionRoute;

    @Column(name = "explanation", columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "recommendation_date")
    private LocalDateTime recommendationDate;

    @PrePersist
    protected void onCreate() {
        recommendationDate = LocalDateTime.now();
    }
}
