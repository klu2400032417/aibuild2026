from agents.base_agent import BaseAgent
from knowledge.shared_context import SharedKnowledgeBase
from negotiation.scoring import calculate_scenario_score

class SimulationAgent(BaseAgent):
    def __init__(self, context: SharedKnowledgeBase):
        super().__init__("SimulationAgent", context)

    def run(self, data: dict):
        self.log("INFO", "Running multi-scenario simulation engine.")
        
        # Base parameters
        base_demand = self.context.get("demand", "forecast", 100.0)
        base_capacity = self.context.get("capacity", "max_capacity", 200.0)
        base_cost = self.context.get("cost", "total_estimated_cost", 1000.0)
        base_sla = self.context.get("sla", "sla_score", 100.0)
        
        # 1. Base Scenario (Optimized Plan)
        scenario_base = {
            "scenario_name": "Base Plan",
            "demand": base_demand,
            "capacity": base_capacity,
            "cost": base_cost,
            "sla_score": base_sla,
            "stockout_risk": "Low",
            "score": calculate_scenario_score(base_cost, base_sla, base_demand / base_capacity if base_capacity > 0 else 0)
        }
        
        # 2. High Demand Scenario (+30% Demand increase)
        high_demand = base_demand * 1.30
        high_cost = base_cost * 1.20 # Increased logistics / shipping costs
        high_sla = max(40.0, base_sla - 15.0) # Pressure on fulfillment lowers SLA score
        high_utilization = high_demand / base_capacity if base_capacity > 0 else 0.0
        scenario_high = {
            "scenario_name": "High Demand (+30%)",
            "demand": round(high_demand, 2),
            "capacity": base_capacity,
            "cost": round(high_cost, 2),
            "sla_score": round(high_sla, 2),
            "stockout_risk": "Medium" if high_utilization < 1.0 else "High",
            "score": calculate_scenario_score(high_cost, high_sla, high_utilization)
        }
        
        # 3. Supply Disruption Scenario (-40% capacity, +50% costs due to logistics rerouting)
        disrupted_capacity = base_capacity * 0.60
        disrupted_cost = base_cost * 1.50
        disrupted_sla = max(30.0, base_sla - 35.0) # High latency in supply
        disrupted_utilization = base_demand / disrupted_capacity if disrupted_capacity > 0 else 0.0
        scenario_disruption = {
            "scenario_name": "Supply Disruption",
            "demand": base_demand,
            "capacity": round(disrupted_capacity, 2),
            "cost": round(disrupted_cost, 2),
            "sla_score": round(disrupted_sla, 2),
            "stockout_risk": "High",
            "score": calculate_scenario_score(disrupted_cost, disrupted_sla, disrupted_utilization)
        }
        
        scenarios = [scenario_base, scenario_high, scenario_disruption]
        
        # Find best scenario (highest score)
        best_scenario = max(scenarios, key=lambda x: x["score"])
        
        self.context.set("simulation", "scenarios", scenarios)
        self.context.set("simulation", "best_scenario", best_scenario["scenario_name"])
        
        self.log("SUCCESS", f"Simulation runs complete. Highest resiliency scenario identified: {best_scenario['scenario_name']} ({best_scenario['score']}%).")
        return scenarios
