package controller;

import dto.RecommendationRequestDTO;
import dto.RecommendationResponseDTO;
import entity.Recommendation;
import service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping
    public ResponseEntity<RecommendationResponseDTO> generateRecommendation(@RequestBody RecommendationRequestDTO request) {
        return ResponseEntity.ok(recommendationService.generateRecommendation(request));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Recommendation>> getRecentRecommendations(@PathVariable Long productId) {
        return ResponseEntity.ok(recommendationService.getRecentRecommendations(productId));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Recommendation> approveRecommendation(@PathVariable Long id) {
        return ResponseEntity.ok(recommendationService.approveRecommendation(id));
    }
}
