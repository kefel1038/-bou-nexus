from fastapi import APIRouter
from models.schemas import (
    CreditScoreRequest,
    CreditScoreResponse,
    FraudAnalysisRequest,
    FraudAnalysisResponse,
    LoanPredictionRequest,
    LoanPredictionResponse,
    SavingsPredictionRequest,
    SavingsPredictionResponse,
)
from models.scoring import CreditScoringModel

router = APIRouter(prefix="/api")
model = CreditScoringModel()


@router.post("/credit-score", response_model=CreditScoreResponse)
async def get_credit_score(request: CreditScoreRequest):
    mm = request.mobileMoneyScore or 50
    crop = request.cropYieldScore or 50
    sales = request.salesScore or 50
    utility = request.utilityScore or 50
    sacco = 1 if request.saccoMember else 0

    score, risk, eligible_loan, factors = model.predict(mm, crop, sales, utility, sacco)

    if risk == "Low":
        recommendation = "Eligible for farm loans, crop insurance, and input financing"
    elif risk == "Medium":
        recommendation = "Consider improving utility payment history to increase score"
    else:
        recommendation = "Start with SACCO membership and build payment history"

    return CreditScoreResponse(
        score=score,
        risk=risk,
        eligibleLoan=eligible_loan,
        factors=factors,
        recommendation=recommendation
    )


@router.post("/fraud/analyze", response_model=FraudAnalysisResponse)
async def analyze_fraud(request: FraudAnalysisRequest):
    risk_score, risk_level, reasons, action = model.predict_risk(
        request.transactionCount,
        request.linkedAccounts,
        request.amount,
        request.location is not None,
        request.unusualTime,
    )

    return FraudAnalysisResponse(
        riskScore=risk_score,
        riskLevel=risk_level,
        reasons=reasons,
        action=action,
    )


@router.post("/loan/predict", response_model=LoanPredictionResponse)
async def predict_loan(request: LoanPredictionRequest):
    prob, recommended, assessment, max_eligible = model.predict_loan_default(
        request.creditScore,
        request.monthlyIncome,
        request.existingLoans,
        request.loanAmount,
        request.loanTerm,
    )

    return LoanPredictionResponse(
        approvalProbability=prob,
        recommendedAmount=recommended,
        riskAssessment=assessment,
        maxEligibleAmount=max_eligible,
    )


@router.post("/savings/predict", response_model=SavingsPredictionResponse)
async def predict_savings(request: SavingsPredictionRequest):
    available = request.monthlyIncome - request.monthlyExpenses
    recommended = max(0, available * 0.3)
    yearly = recommended * 12 + request.currentSavings
    five_year = yearly * 5 * 1.12

    if recommended <= 0:
        advice = "Consider reducing expenses to start saving"
    elif recommended < 100000:
        advice = "Great start! Try to increase savings gradually"
    elif recommended < 500000:
        advice = "Good savings rate! Consider investing in Treasury Bills"
    else:
        advice = "Excellent savings! Look into Treasury Bonds for better returns"

    return SavingsPredictionResponse(
        recommendedMonthlySavings=round(recommended, -3),
        yearlyProjection=round(yearly, -3),
        fiveYearProjection=round(five_year, -3),
        advice=advice,
    )


@router.get("/health")
async def health():
    return {"status": "ok", "model_trained": model.trained}
