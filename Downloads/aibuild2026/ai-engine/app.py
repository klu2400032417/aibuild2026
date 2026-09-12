import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router

app = FastAPI(
    title="NetworkIQ AI Engine",
    description="Multi-agent Supply Chain Optimization Decision Brain",
    version="1.0.0"
)

# Allow CORS for Spring Boot backend and direct developer connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def read_root():
    return {
        "status": "ONLINE",
        "service": "NetworkIQ Multi-Agent supply chain coordinator",
        "endpoints": [
            "/api/v1/recommend",
            "/api/v1/simulate",
            "/api/v1/agent-status"
        ]
    }

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
