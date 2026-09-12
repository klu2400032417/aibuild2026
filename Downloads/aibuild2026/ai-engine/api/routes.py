from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

from knowledge.shared_context import SharedKnowledgeBase
from memory.planner_memory import PlannerMemory
from agents.demand_agent import DemandAgent
from agents.inventory_agent import InventoryAgent
from agents.capacity_agent import CapacityAgent
from agents.cost_agent import CostAgent
from agents.sla_agent import SLAAgent
from negotiation.negotiation_engine import NegotiationEngine
from agents.planner_agent import PlannerAgent
from agents.simulation_agent import SimulationAgent
from agents.explainability_agent import ExplainabilityAgent

router = APIRouter(prefix="/api/v1")

# Share context and memory globally inside routes
shared_context = SharedKnowledgeBase()
planner_memory = PlannerMemory()

class OptimizationRequest(BaseModel):
    product_id: int
    product_name: str
    location: str = "Store"
    source_location: str = "Central Warehouse"
    source_surplus: float = 9999.0
    historical_sales: float = 120.0
    season_index: int = 1
    price: float = 10.0
    promo_active: int = 0
    current_stock: float = 40.0
    lead_time_days: int = 5
    safety_stock: int = 20
    max_capacity: float = 200.0
    unit_cost: float = 15.0
    holding_cost: float = 2.0
    shipping_cost: float = 250.0
    target_delivery_days: int = 10
    sla_penalty_rate: float = 50.0

@router.post("/recommend", response_model=Dict[str, Any])
def generate_recommendation(request: OptimizationRequest):
    try:
        # Clear previous state
        shared_context.clear()
        shared_context.log_agent_action("System", "INFO", f"Triggered optimization pipeline for {request.product_name} (ID: {request.product_id}).")
        
        data = request.dict()
        
        # Instantiate Agents
        demand_agent = DemandAgent(shared_context)
        inventory_agent = InventoryAgent(shared_context)
        capacity_agent = CapacityAgent(shared_context)
        cost_agent = CostAgent(shared_context)
        sla_agent = SLAAgent(shared_context)
        negotiation_engine = NegotiationEngine(shared_context)
        planner_agent = PlannerAgent(shared_context, planner_memory)
        simulation_agent = SimulationAgent(shared_context)
        explainability_agent = ExplainabilityAgent(shared_context)
        
        # Sequentially Run Agents
        demand_agent.run(data)
        inventory_agent.run(data)
        capacity_agent.run(data)
        cost_agent.run(data)
        sla_agent.run(data)
        
        # Run Negotiation Engine
        negotiation_engine.negotiate()
        
        # Run Planner, Simulation, and Explainability
        planner_agent.run(data)
        simulation_agent.run(data)
        explainability_agent.run(data)
        
        # Package and return results
        context_data = shared_context.get_all()
        
        return {
            "product_id": request.product_id,
            "product_name": request.product_name,
            "demand_forecast": context_data["demand"].get("forecast"),
            "recommended_reorder": context_data["inventory"].get("recommended_reorder"),
            "inventory_gap": context_data["inventory"].get("inventory_gap"),
            "max_capacity": context_data["capacity"].get("max_capacity"),
            "capacity_gap": context_data["capacity"].get("capacity_gap"),
            "bottleneck_detected": context_data["capacity"].get("bottleneck_detected"),
            "total_estimated_cost": context_data["cost"].get("total_estimated_cost"),
            "sla_score": context_data["sla"].get("sla_score"),
            "sla_penalty_risk": context_data["sla"].get("sla_penalty_risk"),
            "negotiation_score": context_data["negotiation"].get("result", {}).get("score"),
            "resolution_strategy": context_data["negotiation"].get("result", {}).get("resolution_strategy"),
            "plan": context_data["planner"].get("plan"),
            "scenarios": context_data["simulation"].get("scenarios"),
            "best_scenario": context_data["simulation"].get("best_scenario"),
            "explanation": context_data["explainability"].get("explanation"),
            "logs": context_data["agent_logs"]
        }
    except Exception as e:
        shared_context.log_agent_action("System", "ERROR", f"Pipeline breakdown: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Pipeline Error: {str(e)}")

@router.post("/simulate", response_model=List[Dict[str, Any]])
def run_simulation():
    # Helper endpoint to run simulations on the fly
    scenarios = shared_context.get("simulation", "scenarios")
    if not scenarios:
        # Generate default baseline simulations
        agent = SimulationAgent(shared_context)
        scenarios = agent.run({})
    return scenarios

@router.get("/agent-status", response_model=List[Dict[str, Any]])
def get_agent_logs():
    return shared_context.get_all().get("agent_logs", [])
