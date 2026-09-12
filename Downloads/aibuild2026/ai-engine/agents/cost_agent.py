from agents.base_agent import BaseAgent
from knowledge.shared_context import SharedKnowledgeBase

class CostAgent(BaseAgent):
    def __init__(self, context: SharedKnowledgeBase):
        super().__init__("CostAgent", context)

    def run(self, data: dict):
        self.log("INFO", "Calculating cost projections for the current reorder recommendation.")
        
        recommended_reorder = self.context.get("inventory", "recommended_reorder", 0.0)
        
        unit_procurement_cost = float(data.get("unit_cost", 15.0))
        unit_holding_cost = float(data.get("holding_cost", 2.0))
        fixed_shipping_cost = float(data.get("shipping_cost", 250.0))
        selling_price = float(data.get("price", 10.0))
        
        # Calculations
        procurement_total = recommended_reorder * unit_procurement_cost
        holding_total = recommended_reorder * unit_holding_cost
        total_estimated_cost = procurement_total + holding_total + fixed_shipping_cost
        
        # Profit Margin vs Transfer Cost Guardrail
        unit_margin = max(0.0, selling_price - unit_procurement_cost)
        margin_unlocked = recommended_reorder * unit_margin
        
        cost_guardrail_failed = False
        if recommended_reorder > 0 and margin_unlocked < fixed_shipping_cost:
            cost_guardrail_failed = True
            self.log("WARNING", f"Cost Guardrail FAILED: Transfer cost (${fixed_shipping_cost:.2f}) exceeds profit margin unlocked (${margin_unlocked:.2f})!")
        else:
            self.log("SUCCESS", f"Cost Guardrail PASSED: Margin unlocked (${margin_unlocked:.2f}) is greater than transfer cost (${fixed_shipping_cost:.2f}).")
            
        self.context.set("cost", "unit_cost", unit_procurement_cost)
        self.context.set("cost", "procurement_total", procurement_total)
        self.context.set("cost", "holding_total", holding_total)
        self.context.set("cost", "shipping_cost", fixed_shipping_cost)
        self.context.set("cost", "total_estimated_cost", total_estimated_cost)
        self.context.set("cost", "margin_unlocked", margin_unlocked)
        self.context.set("cost", "cost_guardrail_failed", cost_guardrail_failed)
        
        self.log("SUCCESS", f"Cost calculations complete. Estimated Total Cost: ${total_estimated_cost:.2f}.")
        return total_estimated_cost
