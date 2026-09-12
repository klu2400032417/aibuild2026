package controller;

import entity.SimulationScenario;
import service.SimulationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/simulations")
public class SimulationController {

    private final SimulationService simulationService;

    public SimulationController(SimulationService simulationService) {
        this.simulationService = simulationService;
    }

    @GetMapping("/recommendation/{recommendationId}")
    public ResponseEntity<List<SimulationScenario>> getScenarios(@PathVariable Long recommendationId) {
        return ResponseEntity.ok(simulationService.getScenariosByRecommendation(recommendationId));
    }
}
