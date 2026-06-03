from pydantic import BaseModel
from typing import Optional, List


class CreditScoreRequest(BaseModel):
    phone: str
    name: str
    district: str
    mobileMoneyScore: Optional[float] = None
    cropYieldScore: Optional[float] = None
    salesScore: Optional[float] = None
    utilityScore: Optional[float] = None
    saccoMember: Optional[bool] = False


class CreditScoreResponse(BaseModel):
    score: int
    risk: str
    eligibleLoan: float
    factors: List[dict]
    recommendation: str


class FraudAnalysisRequest(BaseModel):
    accountId: str
    transactionCount: int
    linkedAccounts: int
    amount: float
    location: Optional[str] = None
    unusualTime: Optional[bool] = False


class FraudAnalysisResponse(BaseModel):
    riskScore: int
    riskLevel: str
    reasons: List[str]
    action: str


class LoanPredictionRequest(BaseModel):
    creditScore: int
    monthlyIncome: float
    existingLoans: float
    loanAmount: float
    loanTerm: int


class LoanPredictionResponse(BaseModel):
    approvalProbability: float
    recommendedAmount: float
    riskAssessment: str
    maxEligibleAmount: float


class SavingsPredictionRequest(BaseModel):
    monthlyIncome: float
    monthlyExpenses: float
    currentSavings: float
    age: int
    dependents: int


class SavingsPredictionResponse(BaseModel):
    recommendedMonthlySavings: float
    yearlyProjection: float
    fiveYearProjection: float
    advice: str
