package entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "demand_forecast")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemandForecast {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "forecasted_demand")
    private Double forecastedDemand;

    @Column(name = "historical_sales")
    private Double historicalSales;

    @Column(name = "season_index")
    private Integer seasonIndex;

    @Column(name = "price")
    private Double price;

    @Column(name = "promo_active")
    private Boolean promoActive;

    @Column(name = "forecast_date")
    private LocalDateTime forecastDate;

    @PrePersist
    protected void onCreate() {
        forecastDate = LocalDateTime.now();
    }
}
