def calculate_scenario_score(cost: float, sla_score: float, capacity_utilization: float) -> float:
    """
    Computes a weighted utility score from 0 to 100.
    Lower cost is better (mapped normalized).
    Higher SLA is better.
    Balanced capacity utilization is better (avoid overload, but avoid idle).
    """
    # Normalize cost (assume max benchmark cost of $10,000 for relative comparison)
    cost_score = max(0.0, 100.0 - (cost / 100.0))
    
    # Capacity utility score (ideal utilization is between 70% and 90%)
    if capacity_utilization > 1.0:
        # Overloaded capacity is penalized
        capacity_score = max(20.0, 100.0 - (capacity_utilization - 1.0) * 200.0)
    else:
        # Under-utilization is slightly penalized
        capacity_score = capacity_utilization * 100.0
        
    # Composite score: 40% SLA, 30% Cost, 30% Capacity
    composite = (0.4 * sla_score) + (0.3 * cost_score) + (0.3 * capacity_score)
    return round(float(composite), 2)
