import numpy as np
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import StandardScaler


class CreditScoringModel:
    def __init__(self):
        self.regressor = RandomForestRegressor(n_estimators=100, random_state=42)
        self.classifier = RandomForestClassifier(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.trained = False

    def train(self):
        np.random.seed(42)
        n = 10000

        mobile_money_score = np.random.uniform(0, 100, n)
        crop_yield_score = np.random.uniform(0, 100, n)
        sales_score = np.random.uniform(0, 100, n)
        utility_score = np.random.uniform(0, 100, n)
        sacco_member = np.random.randint(0, 2, n)

        X = np.column_stack([
            mobile_money_score,
            crop_yield_score,
            sales_score,
            utility_score,
            sacco_member
        ])

        y = (
            mobile_money_score * 3 +
            crop_yield_score * 2.5 +
            sales_score * 2.5 +
            utility_score * 2 +
            sacco_member * 50 +
            np.random.normal(0, 30, n)
        )
        y = np.clip(y, 300, 900).astype(int)

        X_scaled = self.scaler.fit_transform(X)
        self.regressor.fit(X_scaled, y)

        y_risk = np.where(y >= 700, 0, np.where(y >= 500, 1, 2))
        self.classifier.fit(X_scaled, y_risk)
        self.trained = True

    def predict(self, mobile_money_score, crop_yield_score, sales_score, utility_score, sacco_member):
        if not self.trained:
            self.train()

        features = np.array([[mobile_money_score, crop_yield_score, sales_score, utility_score, sacco_member]])
        features_scaled = self.scaler.transform(features)

        score = int(self.regressor.predict(features_scaled)[0])
        score = max(300, min(900, score))

        if score >= 700:
            risk = "Low"
            eligible_loan = min(5000000, score / 900 * 5000000)
        elif score >= 500:
            risk = "Medium"
            eligible_loan = min(2000000, score / 900 * 2000000)
        else:
            risk = "High"
            eligible_loan = min(500000, score / 900 * 500000)

        factors = [
            {"name": "Mobile Money History", "score": float(mobile_money_score), "weight": 0.30, "contribution": float(mobile_money_score * 0.30)},
            {"name": "Crop Yield Data", "score": float(crop_yield_score), "weight": 0.25, "contribution": float(crop_yield_score * 0.25)},
            {"name": "Monthly Sales", "score": float(sales_score), "weight": 0.25, "contribution": float(sales_score * 0.25)},
            {"name": "Utility Payments", "score": float(utility_score), "weight": 0.20, "contribution": float(utility_score * 0.20)},
            {"name": "SACCO Membership", "score": float(sacco_member * 100), "weight": 0.05, "contribution": float(sacco_member * 50)},
        ]

        return score, risk, round(eligible_loan, -3), factors

    def predict_risk(self, transaction_count, linked_accounts, amount, unusual_location, unusual_time):
        risk = 0
        reasons = []

        if transaction_count > 10:
            risk += 30
            reasons.append(f"{transaction_count} transfers in short period")

        if linked_accounts > 5:
            risk += 20
            reasons.append(f"Linked to {linked_accounts} accounts")

        if amount > 5000000:
            risk += 15
            reasons.append(f"Large transaction amount: UGX {amount:,.0f}")

        if unusual_location:
            risk += 15
            reasons.append("Unusual geographic activity")

        if unusual_time:
            risk += 10
            reasons.append("Transaction at unusual hours")

        risk = min(99, risk)

        if risk >= 70:
            level = "High"
            action = "Flag for immediate review"
        elif risk >= 40:
            level = "Medium"
            action = "Flag for review"
        else:
            level = "Low"
            action = "Allow transaction"

        return risk, level, reasons, action

    def predict_loan_default(self, credit_score, monthly_income, existing_loans, loan_amount, loan_term):
        if not self.trained:
            self.train()

        dti_ratio = existing_loans / max(monthly_income, 1)
        lti_ratio = loan_amount / max(monthly_income * loan_term, 1)

        base_prob = credit_score / 900 * 0.8
        dti_penalty = max(0, dti_ratio - 0.4) * 0.3
        lti_penalty = max(0, lti_ratio - 0.3) * 0.3

        probability = max(0, min(1, base_prob - dti_penalty - lti_penalty))

        max_eligible = monthly_income * 12 * 0.4
        recommended = min(loan_amount, max_eligible)

        if probability >= 0.7:
            assessment = "Good"
        elif probability >= 0.4:
            assessment = "Fair"
        else:
            assessment = "Poor"

        return round(probability, 3), round(recommended, -3), assessment, round(max_eligible, -3)
