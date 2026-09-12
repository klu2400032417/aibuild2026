package dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimulationResultDTO {
    private String scenarioName;
    private Double demand;
    private Double capacity;
    private Double cost;
    private Double slaScore;
    private String stockoutRisk;
    private Double score;
}
