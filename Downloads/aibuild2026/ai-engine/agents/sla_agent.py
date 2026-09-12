from agents.base_agent import BaseAgent
from knowledge.shared_context import SharedKnowledgeBase

class SLAAgent(BaseAgent):
    def __init__(self, context: SharedKnowledgeBase):
        super().__init__("SLAAgent", context)

    def run(self, data: dict):
        self.log("INFO", "Assessing SLA compliance and delivery deadline risk parameters.")
        
        inventory_gap = self.context.get("inventory", "inventory_gap", 0.0)
        supplier_lead_time = self.context.get("capacity", "supplier_lead_time", 7)
        
        target_delivery_days = int(data.get("target_delivery_days", 10))
        sla_penalty_rate = float(data.get("sla_penalty_rate", 50.0)) # Cost per day late or unit late
        
        # Simple SLA score calculation
        if supplier_lead_time > target_delivery_days:
            delay = supplier_lead_time - target_delivery_days
            sla_score = max(30.0, 100.0 - (delay * 15.0))
            sla_penalty_risk = inventory_gap * sla_penalty_rate * delay
            self.log("WARNING", f"Lead time ({supplier_lead_time} days) exceeds target delivery days ({target_delivery_days}). Potential delay of {delay} days.")
        else:
            sla_score = 100.0
            sla_penalty_risk = 0.0
            self.log("SUCCESS", "Delivery timeline complies with SLA target.")
            
        self.context.set("sla", "sla_score", sla_score)
        self.context.set("sla", "sla_penalty_risk", sla_penalty_risk)
        self.context.set("sla", "target_delivery_days", target_delivery_days)
        
        return sla_score
