from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.credit import router as credit_router

app = FastAPI(
    title="BoU Nexus AI Credit Scoring Engine",
    description="AI-powered credit scoring, fraud analysis, loan prediction, and savings prediction for Bank of Uganda",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(credit_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
