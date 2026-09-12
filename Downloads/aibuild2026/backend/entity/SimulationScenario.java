package entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "simulation_scenario")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SimulationScenario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recommendation_id")
    private Long recommendationId;

    @Column(name = "scenario_name", nullable = false)
    private String scenarioName;

    @Column(name = "demand")
    private Double demand;

    @Column(name = "capacity")
    private Double capacity;

    @Column(name = "cost")
    private Double cost;

    @Column(name = "sla_score")
    private Double slaScore;

    @Column(name = "stockout_risk")
    private String stockoutRisk;

    @Column(name = "score")
    private Double score;
}
