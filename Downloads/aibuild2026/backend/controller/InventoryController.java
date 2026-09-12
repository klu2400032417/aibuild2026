package controller;

import entity.Inventory;
import service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<List<Inventory>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inventory> getInventoryById(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryService.getInventoryById(id));
    }

    @PostMapping
    public ResponseEntity<Inventory> createInventory(@RequestBody Inventory inventory) {
        return ResponseEntity.ok(inventoryService.createOrUpdateInventory(inventory));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inventory> updateInventory(@PathVariable Long id, @RequestBody Inventory inventory) {
        Inventory existing = inventoryService.getInventoryById(id);
        existing.setProductName(inventory.getProductName());
        existing.setSku(inventory.getSku());
        existing.setCurrentStock(inventory.getCurrentStock());
        existing.setSafetyStock(inventory.getSafetyStock());
        existing.setLeadTimeDays(inventory.getLeadTimeDays());
        existing.setUnitCost(inventory.getUnitCost());
        existing.setHoldingCost(inventory.getHoldingCost());
        existing.setMaxCapacity(inventory.getMaxCapacity());
        
        return ResponseEntity.ok(inventoryService.createOrUpdateInventory(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventory(@PathVariable Long id) {
        inventoryService.deleteInventory(id);
        return ResponseEntity.noContent().build();
    }
}
