import os
from agents.base_agent import BaseAgent
from knowledge.shared_context import SharedKnowledgeBase

class ExplainabilityAgent(BaseAgent):
    def __init__(self, context: SharedKnowledgeBase):
        super().__init__("ExplainabilityAgent", context)

    def run(self, data: dict):
        self.log("INFO", "Generating business-friendly optimization rationale.")
        
        product_id = data.get("product_id", 1)
        product_name = data.get("product_name", "Product A")
        
        # Load from shared context
        demand_forecast = self.context.get("demand", "forecast", 0.0)
        inventory_gap = self.context.get("inventory", "inventory_gap", 0.0)
        reorder_qty = self.context.get("inventory", "recommended_reorder", 0.0)
        total_cost = self.context.get("cost", "total_estimated_cost", 0.0)
        sla_score = self.context.get("sla", "sla_score", 100.0)
        
        negotiation = self.context.get("negotiation", "result", {})
        negotiated_qty = negotiation.get("final_target_qty", demand_forecast)
        strategy = negotiation.get("resolution_strategy", "STANDARD")

        # Load prompt template
        prompt_path = os.path.join("prompts", "explanation_prompt.txt")
        prompt_template = ""
        if os.path.exists(prompt_path):
            with open(prompt_path, "r") as f:
                prompt_template = f.read()
        else:
            prompt_template = "Explain: Product {product_name}, forecast {demand_forecast}, cost ${total_cost}."

        # Format prompt
        formatted_prompt = prompt_template.format(
            product_name=product_name,
            product_id=product_id,
            demand_forecast=demand_forecast,
            inventory_gap=inventory_gap,
            production_qty=negotiated_qty,
            total_cost=total_cost,
            sla_score=sla_score,
            negotiation_summary=strategy
        )

        # Dynamic NLG Rationale Construction
        location = self.context.get("inventory", "location", "Store")
        
        if strategy == "WAREHOUSE_SOURCE_HUB":
            resolution_text = (
                f"This location is the Central Warehouse (Source Hub). Current inventory levels are sufficient and "
                f"no inter-location stock transfers are required."
            )
        elif strategy == "COST_GUARDRAIL_BLOCKED":
            resolution_text = (
                f"The stock transfer request of {reorder_qty} units was canceled because the total distribution/shipping cost "
                f"(${self.context.get('cost', 'shipping_cost', 250.0):,.2f}) is greater than the total profit margin unlocked "
                f"(${self.context.get('cost', 'margin_unlocked', 0.0):,.2f}). This satisfies the Cost Guardrail, preventing "
                f"unprofitable stock placements."
            )
        elif strategy == "CAPACITY_CAPPED_PLAN":
            resolution_text = (
                f"The initial reorder request of {reorder_qty} units exceeded the store's maximum capacity of "
                f"{self.context.get('capacity', 'max_capacity', 200.0)} units. The Negotiation Engine capped primary "
                f"transfer at the ceiling to prevent store overload, mitigating storage bottleneck risks."
            )
        elif strategy == "PRIORITIZE_SPEED_OVER_COST":
            resolution_text = (
                f"Due to supply delays, the SLA Agent detected a high penalty risk. The Negotiation Engine activated the "
                f"expedited distribution strategy. Although this increases transit and handling charges, it preserves the SLA "
                f"compliance score of {sla_score}%."
            )
        else:
            resolution_text = (
                f"Supplier capacity and lead times are within nominal parameters. The recommended transfer of {negotiated_qty} "
                f"units fully addresses the inventory gap of {inventory_gap} units at {location} and ensures safety stock targets are maintained."
            )

        if "warehouse" in location.lower():
            exec_summary = f"Location **{location}** (ID: {product_id}) is the central source hub. Current stock is sufficient; no inbound transfers are recommended.\n\n"
        elif strategy == "COST_GUARDRAIL_BLOCKED":
            exec_summary = (
                f"A stock transfer for **{product_name}** to **{location}** was requested but **BLOCKED** by the Cost Guardrail. "
                f"Transfer cost exceeds the profit margin it would unlock.\n\n"
            )
        else:
            source_location = self.context.get("inventory", "source_location", "Central Warehouse")
            exec_summary = (
                f"The recommended action plan for **{product_name}** at **{location}** prescribes a transfer quantity of "
                f"**{negotiated_qty} units** from **{source_location}**, incurring an estimated fulfillment cost of **${total_cost:,.2f}** "
                f"with an SLA reliability projection of **{sla_score}%**.\n\n"
            )

        explanation = (
            f"### Executive Summary\n"
            + exec_summary +
            f"### Optimization Rationale\n"
            f"- **Supply/Demand Balancing:** {resolution_text}\n"
            f"- **Cost Sensitivity Analysis:** Total holding costs ($"
            f"{self.context.get('cost', 'holding_total', 0.0):,.2f}) were weighed against standard procurement expenses to "
            f"minimize inventory overhead.\n"
            f"- **Risk Mitigation:** The Planner has selected '{self.context.get('planner', 'plan', {}).get('distribution_route', 'Standard Route')}' "
            f"routing to optimize transit speed relative to cost thresholds.\n"
        )

        self.context.set("explainability", "explanation", explanation)
        self.context.set("explainability", "prompt", formatted_prompt)
        
        self.log("SUCCESS", "Optimization rationale generated successfully.")
        return explanation
