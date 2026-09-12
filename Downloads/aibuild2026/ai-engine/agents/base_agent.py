from knowledge.shared_context import SharedKnowledgeBase

class BaseAgent:
    def __init__(self, name: str, context: SharedKnowledgeBase):
        self.name = name
        self.context = context

    def log(self, status: str, message: str):
        self.context.log_agent_action(self.name, status, message)

    def run(self, data: dict):
        raise NotImplementedError("Each agent must implement run(data)")
