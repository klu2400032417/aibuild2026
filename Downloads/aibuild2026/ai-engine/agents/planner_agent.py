import os
from agents.base_agent import BaseAgent
from knowledge.shared_context import SharedKnowledgeBase
from memory.planner_memory import PlannerMemory

class PlannerAgent(BaseAgent):
    def __init__(self, context: SharedKnowledgeBase, memory: PlannerMemory):
        super().__init__("PlannerAgent", context)
        self.memory = memory

    def run(self, data: dict):
        self.log("INFO", "Synthesizing master production plan.")
        
        # Gather context data
        demand_forecast = self.context.get("demand", "forecast", 0.0)
        inventory_gap = self.context.get("inventory", "inventory_gap", 0.0)
        max_capacity = self.context.get("capacity", "max_capacity", 0.0)
        total_cost = self.context.get("cost", "total_estimated_cost", 0.0)
        sla_score = self.context.get("sla", "sla_score", 100.0)
        
        negotiation = self.context.get("negotiation", "result", {})
        negotiated_qty = negotiation.get("final_target_qty", demand_forecast)
        strategy = negotiation.get("resolution_strategy", "STANDARD")

        # Load Prompt Template
        prompt_path = os.path.join("prompts", "planner_prompt.txt")
        prompt_template = ""
        if os.path.exists(prompt_path):
            with open(prompt_path, "r") as f:
                prompt_template = f.read()
        else:
            prompt_template = "SYSTEM: Master Planner Agent. Demand: {demand_forecast}, Inventory Gap: {inventory_gap}, Limit: {factory_capacity}."

        # Format prompt
        formatted_prompt = prompt_template.format(
            demand_forecast=demand_forecast,
            inventory_gap=inventory_gap,
            factory_capacity=max_capacity,
            cost_analysis=total_cost,
            sla_requirements=sla_score,
            negotiation_directives=strategy
        )

        # Plan Assembly
        plan = {
            "production_run_qty": negotiated_qty,
            "procurement_qty": max(0.0, demand_forecast - negotiated_qty),
            "priority": "HIGH" if (sla_score < 80.0 or inventory_gap > 100) else "MEDIUM",
            "distribution_route": "Express Regional Hub" if strategy == "PRIORITIZE_SPEED_OVER_COST" else "Standard Cargo Rail",
            "bottlenecks": ["Supplier Capacity Cap" if negotiated_qty >= max_capacity else "None"],
            "notes": f"Plan executed using strategy {strategy}. Overall health is stable."
        }

        # Store to Shared Context and Memory
        self.context.set("planner", "plan", plan)
        self.context.set("planner", "prompt", formatted_prompt)
        
        product_id = int(data.get("product_id", 1))
        self.memory.save_plan(product_id, plan)

        self.log("SUCCESS", f"Master Production Plan finalized: Qty {negotiated_qty} via {plan['distribution_route']}.")
        return plan
