import threading
from datetime import datetime

class SharedKnowledgeBase:
    def __init__(self):
        self._lock = threading.Lock()
        self.data = {
            "demand": {},
            "inventory": {},
            "capacity": {},
            "cost": {},
            "sla": {},
            "negotiation": {},
            "planner": {},
            "simulation": {},
            "explainability": {},
            "agent_logs": [] # Thread-safe agent log list for frontend streaming
        }
        
    def set(self, agent_name: str, key: str, value):
        with self._lock:
            if agent_name not in self.data:
                self.data[agent_name] = {}
            self.data[agent_name][key] = value

    def get(self, agent_name: str, key: str, default=None):
        with self._lock:
            return self.data.get(agent_name, {}).get(key, default)

    def get_all(self):
        with self._lock:
            import copy
            return copy.deepcopy(self.data)

    def log_agent_action(self, agent_name: str, status: str, message: str):
        with self._lock:
            log_entry = {
                "timestamp": datetime.now().isoformat(),
                "agent": agent_name,
                "status": status,  # e.g., "INFO", "WARNING", "SUCCESS"
                "message": message
            }
            self.data["agent_logs"].append(log_entry)
            print(f"[{agent_name}] {status}: {message}")

    def clear(self):
        with self._lock:
            self.data = {
                "demand": {},
                "inventory": {},
                "capacity": {},
                "cost": {},
                "sla": {},
                "negotiation": {},
                "planner": {},
                "simulation": {},
                "explainability": {},
                "agent_logs": []
            }
