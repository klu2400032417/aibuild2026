from agents.base_agent import BaseAgent
from knowledge.shared_context import SharedKnowledgeBase

class CapacityAgent(BaseAgent):
    def __init__(self, context: SharedKnowledgeBase):
        super().__init__("CapacityAgent", context)

    def run(self, data: dict):
        self.log("INFO", "Evaluating supplier and factory throughput capacity.")
        
        recommended_reorder = self.context.get("inventory", "recommended_reorder", 0.0)
        max_capacity = float(data.get("max_capacity", 200.0))
        supplier_lead_time = int(data.get("supplier_lead_time", 7))
        
        capacity_gap = 0.0
        bottleneck = False
        
        if recommended_reorder > max_capacity:
            capacity_gap = recommended_reorder - max_capacity
            bottleneck = True
            self.log("WARNING", f"Reorder qty ({recommended_reorder}) exceeds max capacity ({max_capacity}). Overload by {capacity_gap} units.")
        else:
            self.log("SUCCESS", f"Capacity check passed. Factory capacity of {max_capacity} is sufficient.")
            
        self.context.set("capacity", "max_capacity", max_capacity)
        self.context.set("capacity", "capacity_gap", capacity_gap)
        self.context.set("capacity", "bottleneck_detected", bottleneck)
        self.context.set("capacity", "supplier_lead_time", supplier_lead_time)
        
        return capacity_gap
