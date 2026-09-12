import threading

class PlannerMemory:
    def __init__(self):
        self._lock = threading.Lock()
        self.history = []

    def save_plan(self, product_id: int, plan: dict):
        with self._lock:
            self.history.append({
                "product_id": product_id,
                "plan": plan
            })

    def get_recent_plans(self, limit: int = 5):
        with self._lock:
            return self.history[-limit:]

    def clear_memory(self):
        with self._lock:
            self.history.clear()
