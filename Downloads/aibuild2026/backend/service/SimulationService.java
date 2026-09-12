package service;

import entity.SimulationScenario;
import repository.SimulationScenarioRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SimulationService {

    private final SimulationScenarioRepository simulationScenarioRepository;

    public SimulationService(SimulationScenarioRepository simulationScenarioRepository) {
        this.simulationScenarioRepository = simulationScenarioRepository;
    }

    public List<SimulationScenario> getScenariosByRecommendation(Long recommendationId) {
        return simulationScenarioRepository.findByRecommendationId(recommendationId);
    }
}
