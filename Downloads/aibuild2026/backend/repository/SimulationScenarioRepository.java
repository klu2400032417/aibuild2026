package repository;

import entity.SimulationScenario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SimulationScenarioRepository extends JpaRepository<SimulationScenario, Long> {
    List<SimulationScenario> findByRecommendationId(Long recommendationId);
}
