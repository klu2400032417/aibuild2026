package dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationRequestDTO {
    private Long productId;
    private Double historicalSales;
    private Integer seasonIndex;
    private Double price;
    private Integer promoActive;
}
