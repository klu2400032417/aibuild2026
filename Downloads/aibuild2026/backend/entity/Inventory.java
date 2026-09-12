package entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "sku", nullable = false, unique = true)
    private String sku;

    @Column(name = "location")
    private String location;

    @Column(name = "current_stock")
    private Double currentStock;

    @Column(name = "safety_stock")
    private Integer safetyStock;

    @Column(name = "lead_time_days")
    private Integer leadTimeDays;

    @Column(name = "unit_cost")
    private Double unitCost;

    @Column(name = "holding_cost")
    private Double holdingCost;

    @Column(name = "max_capacity")
    private Double maxCapacity;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
}
