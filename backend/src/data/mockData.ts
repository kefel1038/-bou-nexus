import { v4 as uuid } from "uuid";

export const districts = [
  "Kampala", "Wakiso", "Mbarara", "Gulu", "Arua", "Mbale",
  "Soroti", "Lira", "Karamoja", "Jinja", "Masaka", "Kasese",
  "Fort Portal", "Kabale", "Busia", "Tororo", "Hoima", "Masindi",
  "Luwero", "Mukono", "Iganga", "Pallisa", "Kumi"
];

export interface User {
  id: string; phone: string; name: string; district: string;
  role: "citizen" | "farmer" | "sme" | "sacco" | "bank" | "bou_analyst" | "admin";
  language: string; balance: number; creditScore?: number;
}

export interface SavingsAccount {
  id: string; userId: string; name: string; district: string;
  phone: string; amount: number; investmentType: "savings" | "tbill" | "tbond";
  timestamp: string; status: "active" | "matured";
  expectedReturn: number;
}

export interface Investment {
  id: string; userId: string; name: string; district: string;
  phone: string; amount: number; type: "tbill" | "tbond";
  rate: number; timestamp: string; maturityDate: string;
}

export interface CreditScoreResult {
  id: string; userId: string; name: string; district: string;
  score: number; risk: "Low" | "Medium" | "High";
  eligibleLoan: number; factors: CreditFactor[];
  timestamp: string;
}

export interface CreditFactor {
  name: string; score: number; weight: number;
}

export interface Complaint {
  id: string; name: string; phone: string; district: string;
  complaintType: "fraud" | "hidden_charges" | "loan_abuse" | "agent_misconduct";
  language: "English" | "Luganda" | "Luo" | "Runyankole" | "Ateso" | "Swahili";
  message: string; status: "open" | "investigating" | "resolved";
  timestamp: string; resolvedAt?: string;
}

export interface FraudAlert {
  id: string; accountId: string; accountName: string; district: string;
  riskScore: number; reason: string; status: "flagged" | "investigating" | "resolved";
  transactionCount: number; linkedAccounts: number; timestamp: string;
}

export interface SME {
  id: string; ownerId: string; businessName: string; ownerName: string;
  district: string; sector: string; monthlyRevenue: number;
  healthScore: number; registeredAt: string;
}

export interface InventoryItem {
  id: string; smeId: string; name: string; quantity: number;
  unitPrice: number; category: string;
}

export interface CashflowRecord {
  id: string; smeId: string; type: "income" | "expense";
  amount: number; category: string; description: string; date: string;
}

export interface FXRate {
  pair: string; buy: number; sell: number; change: number; date: string;
}

export interface InclusionData {
  district: string; accessScore: number; bankBranches: number;
  agents: number; saccos: number; atms: number; population: number;
  recommendedAgents: number;
}

export interface EscrowTransaction {
  id: string; parentId: string; parentName: string; parentPhone: string;
  schoolName: string; studentName: string; amount: number;
  status: "deposited" | "requested" | "approved" | "released";
  depositedAt: string; requestedAt?: string; approvedAt?: string; releasedAt?: string;
}

const firstNames = [
  "Moses", "Grace", "John", "Sarah", "Peter", "Esther", "Samuel", "Ruth",
  "David", "Deborah", "Joseph", "Mary", "Daniel", "Peace", "James", "Martha",
  "Paul", "Agnes", "Philip", "Jane", "Andrew", "Joy", "Simon", "Faith",
  "Isaac", "Rebecca", "Benjamin", "Lydia", "Abraham", "Naomi", "Patrick", "Susan",
  "Edward", "Florence", "Robert", "Alice", "William", "Margaret", "Charles", "Helen"
];

const lastNames = [
  "Okello", "Nakato", "Muwonge", "Namugga", "Ochieng", "Akello", "Ssempijja",
  "Nansubuga", "Kato", "Nalwanga", "Wasswa", "Babirye", "Lubega", "Nakibuule",
  "Mukasa", "Nanyonjo", "Kintu", "Nakamya", "Lule", "Nakiwala", "Tendo",
  "Nantongo", "Bwogi", "Namuddu", "Mutebi", "Najjuko", "Kizza", "Nabatanzi",
  "Mpagi", "Nabunya", "Sserwadda", "Nalule", "Kawuma", "Nantege", "Magezi"
];

const sectors = [
  "Agriculture", "Retail", "Transport", "Manufacturing", "Technology",
  "Hospitality", "Construction", "Healthcare", "Education", "Financial Services"
];

const schools = [
  "St. Mary's College Kisubi", "Gayaza High School", "Ntare School",
  "King's College Budo", "Mount Mary College", "St. Joseph's Nagalama",
  "Trinity College Nabbingo", "Busoga College Mwiri", "Kololo High School",
  "Kampala High School", "St. Henry's Kitovu", "Maryhill High School"
];

const studentNames = [
  "Aisha Nantongo", "Brian Mugisha", "Catherine Nakato", "Daniel Okello",
  "Esther Nalwanga", "Francis Kwizera", "Grace Namugga", "Henry Ssempijja"
];

const complaintMessages = [
  "I was charged hidden fees on my loan application",
  "An agent demanded extra payment for service",
  "My account was debited without authorization",
  "The loan terms were different from what was explained",
  "I suspect fraudulent activity on my savings account",
  "The interest rate was not disclosed properly",
  "An agent misrepresented the product",
  "I have been overcharged on transaction fees"
];

const fraudReasons = [
  "Multiple failed login attempts from different locations",
  "Unusual large transaction pattern detected",
  "Account accessed from new device in different region",
  "Rapid micro-transactions followed by large withdrawal",
  "Known fraud pattern: round-tripping detected",
  "Suspicious linked accounts with identical profiles",
  "Transaction velocity exceeding normal thresholds",
  "Geographic anomaly in transaction sequence"
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomDate(startYear = 2024, endYear = 2024): string {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  return new Date(start + Math.random() * (end - start)).toISOString();
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickWeightedDistricts(): string {
  const weightMap: Record<string, number> = {
    "Kampala": 25, "Wakiso": 18, "Mbarara": 10, "Gulu": 8, "Jinja": 7,
    "Mbale": 6, "Mukono": 5, "Arua": 4, "Lira": 3, "Soroti": 3,
    "Masaka": 3, "Hoima": 2, "Kasese": 2, "Fort Portal": 1, "Kabale": 1,
    "Busia": 1, "Tororo": 0.5, "Masindi": 0.5, "Luwero": 0.5, "Iganga": 0.5,
    "Pallisa": 0.5, "Kumi": 0.5, "Karamoja": 0.5
  };
  const total = Object.values(weightMap).reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (const [district, weight] of Object.entries(weightMap)) {
    rand -= weight;
    if (rand <= 0) return district;
  }
  return "Kampala";
}

const languages = ["English", "Luganda", "Luo", "Runyankole", "Ateso", "Swahili"];

export function generateUsers(count = 80): User[] {
  const users: User[] = [];
  const roles: User["role"][] = ["citizen", "farmer", "sme", "sacco", "bank", "bou_analyst", "admin"];
  const roleWeights = [35, 20, 15, 8, 5, 2, 1];

  for (let i = 0; i < count; i++) {
    const first = pickRandom(firstNames);
    const last = pickRandom(lastNames);
    const totalWeight = roleWeights.reduce((a, b) => a + b, 0);
    let r = Math.random() * totalWeight;
    let role = roles[0];
    for (let j = 0; j < roles.length; j++) {
      r -= roleWeights[j];
      if (r <= 0) { role = roles[j]; break; }
    }

    users.push({
      id: uuid(),
      phone: `+2567${randomInt(0, 9)}${String(randomInt(100000, 999999))}`,
      name: `${first} ${last}`,
      district: pickWeightedDistricts(),
      role,
      language: pickRandom(languages),
      balance: randomFloat(10000, 50000000),
      creditScore: randomInt(300, 900),
    });
  }
  return users;
}

export function generateSavingsAccounts(users: User[]): SavingsAccount[] {
  const accounts: SavingsAccount[] = [];
  const types: SavingsAccount["investmentType"][] = ["savings", "tbill", "tbond"];

  for (const user of users.slice(0, randomInt(50, 60))) {
    const numAccounts = randomInt(1, 3);
    for (let i = 0; i < numAccounts; i++) {
      const amount = randomFloat(50000, 10000000);
      const type = pickRandom(types);
      const rate = type === "tbill" ? 0.12 : type === "tbond" ? 0.14 : 0.04;
      const months = type === "savings" ? randomInt(1, 12) : randomInt(3, 24);
      const isMatured = type !== "savings" && Math.random() > 0.6;
      const created = new Date(2024, 0, 1).getTime() + Math.random() * (300 * 24 * 60 * 60 * 1000);

      accounts.push({
        id: uuid(),
        userId: user.id,
        name: user.name,
        district: user.district,
        phone: user.phone,
        amount,
        investmentType: type,
        timestamp: new Date(created).toISOString(),
        status: isMatured ? "matured" : "active",
        expectedReturn: type === "savings" ? 0 : parseFloat((amount * rate * (months / 12)).toFixed(2)),
      });
    }
  }
  return accounts;
}

export function generateInvestments(users: User[]): Investment[] {
  const investments: Investment[] = [];
  const investableUsers = users.filter(u => u.balance > 500000);

  for (const user of investableUsers.slice(0, randomInt(20, 35))) {
    const numInvestments = randomInt(1, 2);
    for (let i = 0; i < numInvestments; i++) {
      const type = Math.random() > 0.5 ? "tbill" : "tbond";
      const amount = randomFloat(500000, 20000000);
      const days = type === "tbill" ? 91 : 365;
      const created = new Date(2024, 0, 1).getTime() + Math.random() * (300 * 24 * 60 * 60 * 1000);
      const maturity = new Date(created + days * 24 * 60 * 60 * 1000);

      investments.push({
        id: uuid(),
        userId: user.id,
        name: user.name,
        district: user.district,
        phone: user.phone,
        amount,
        type,
        rate: type === "tbill" ? 12 : 14,
        timestamp: new Date(created).toISOString(),
        maturityDate: maturity.toISOString(),
      });
    }
  }
  return investments;
}

export function generateCreditScores(users: User[]): CreditScoreResult[] {
  const scores: CreditScoreResult[] = [];
  const factorNames = [
    "Mobile Money History", "Crop Yield History", "Sales History",
    "Utility Payments", "SACCO Membership", "Loan Repayment",
    "Business Longevity", "Savings Behavior"
  ];

  for (const user of users.slice(0, randomInt(50, 70))) {
    const numFactors = randomInt(3, 6);
    const selectedFactors = factorNames.sort(() => Math.random() - 0.5).slice(0, numFactors);
    const factors: CreditFactor[] = selectedFactors.map((name) => ({
      name,
      score: randomInt(40, 100),
      weight: randomFloat(0.05, 0.4),
    }));
    const totalWeight = factors.reduce((s, f) => s + f.weight, 0);
    const normalized = factors.map(f => ({ ...f, weight: parseFloat((f.weight / totalWeight).toFixed(3)) }));
    const rawScore = normalized.reduce((s, f) => s + f.score * f.weight, 0) * 10;
    const finalScore = Math.min(900, Math.max(300, Math.round(rawScore)));

    let risk: "Low" | "Medium" | "High";
    if (finalScore >= 700) risk = "Low";
    else if (finalScore >= 500) risk = "Medium";
    else risk = "High";

    let eligibleLoan: number;
    if (risk === "Low") eligibleLoan = Math.round((finalScore / 900) * 5000000);
    else if (risk === "Medium") eligibleLoan = Math.round((finalScore / 900) * 2000000);
    else eligibleLoan = Math.round((finalScore / 900) * 500000);

    scores.push({
      id: uuid(),
      userId: user.id,
      name: user.name,
      district: user.district,
      score: finalScore,
      risk,
      eligibleLoan,
      factors: normalized,
      timestamp: randomDate(),
    });
  }
  return scores;
}

export function generateComplaints(users: User[]): Complaint[] {
  const complaints: Complaint[] = [];
  const types: Complaint["complaintType"][] = ["fraud", "hidden_charges", "loan_abuse", "agent_misconduct"];

  for (let i = 0; i < randomInt(30, 50); i++) {
    const user = pickRandom(users);
    const statuses: Complaint["status"][] = ["open", "investigating", "resolved"];
    const statusWeights = [0.3, 0.3, 0.4];
    let r = Math.random();
    let status = statuses[0];
    for (let j = 0; j < statuses.length; j++) {
      r -= statusWeights[j];
      if (r <= 0) { status = statuses[j]; break; }
    }

    const created = new Date(2024, 0, 1).getTime() + Math.random() * (300 * 24 * 60 * 60 * 1000);
    const resolvedAt = status === "resolved"
      ? new Date(created + randomInt(1, 30) * 24 * 60 * 60 * 1000).toISOString()
      : undefined;

    complaints.push({
      id: uuid(),
      name: user.name,
      phone: user.phone,
      district: user.district,
      complaintType: pickRandom(types),
      language: pickRandom(languages) as Complaint["language"],
      message: pickRandom(complaintMessages),
      status,
      timestamp: new Date(created).toISOString(),
      resolvedAt,
    });
  }
  return complaints;
}

export function generateFraudAlerts(): FraudAlert[] {
  const alerts: FraudAlert[] = [];

  for (let i = 0; i < randomInt(15, 30); i++) {
    const district = pickWeightedDistricts();
    const statuses: FraudAlert["status"][] = ["flagged", "investigating", "resolved"];
    const statusWeights = [0.4, 0.35, 0.25];
    let r = Math.random();
    let status = statuses[0];
    for (let j = 0; j < statuses.length; j++) {
      r -= statusWeights[j];
      if (r <= 0) { status = statuses[j]; break; }
    }

    alerts.push({
      id: uuid(),
      accountId: uuid(),
      accountName: `${pickRandom(firstNames)} ${pickRandom(lastNames)}`,
      district,
      riskScore: randomInt(60, 99),
      reason: pickRandom(fraudReasons),
      status,
      transactionCount: randomInt(5, 200),
      linkedAccounts: randomInt(0, 15),
      timestamp: randomDate(),
    });
  }
  return alerts;
}

export function generateSMEs(): SME[] {
  const smes: SME[] = [];

  for (let i = 0; i < randomInt(20, 35); i++) {
    const ownerFirst = pickRandom(firstNames);
    const ownerLast = pickRandom(lastNames);

    smes.push({
      id: uuid(),
      ownerId: uuid(),
      businessName: `${ownerLast} ${pickRandom(["Enterprises", "Trading Co.", "Services", "General Merchandise", "Suppliers", "Ventures"])}`,
      ownerName: `${ownerFirst} ${ownerLast}`,
      district: pickWeightedDistricts(),
      sector: pickRandom(sectors),
      monthlyRevenue: randomFloat(500000, 50000000),
      healthScore: randomInt(20, 100),
      registeredAt: randomDate(2022, 2024),
    });
  }
  return smes;
}

export function generateInventory(smes: SME[]): InventoryItem[] {
  const items: InventoryItem[] = [];
  const categories = ["Raw Materials", "Finished Goods", "Equipment", "Supplies", "Merchandise"];
  const itemNames = ["Maize Flour", "Coffee Beans", "Textiles", "Building Materials", "Electronics",
    "Furniture", "Spare Parts", "Packaging Materials", "Cleaning Supplies", "Office Stationery"];

  for (const sme of smes) {
    const numItems = randomInt(2, 8);
    for (let i = 0; i < numItems; i++) {
      items.push({
        id: uuid(),
        smeId: sme.id,
        name: pickRandom(itemNames),
        quantity: randomInt(10, 1000),
        unitPrice: randomFloat(1000, 500000),
        category: pickRandom(categories),
      });
    }
  }
  return items;
}

export function generateCashflow(smes: SME[]): CashflowRecord[] {
  const records: CashflowRecord[] = [];
  const incomeCategories = ["Sales", "Services", "Investment", "Grants"];
  const expenseCategories = ["Rent", "Utilities", "Salaries", "Supplies", "Transport", "Taxes", "Marketing"];

  for (const sme of smes) {
    const numRecords = randomInt(10, 20);
    for (let i = 0; i < numRecords; i++) {
      const isIncome = Math.random() > 0.5;
      records.push({
        id: uuid(),
        smeId: sme.id,
        type: isIncome ? "income" : "expense",
        amount: randomFloat(100000, 5000000),
        category: pickRandom(isIncome ? incomeCategories : expenseCategories),
        description: `${isIncome ? "Revenue from" : "Payment for"} ${pickRandom(["monthly", "quarterly", "annual", "weekly"])} operations`,
        date: randomDate(),
      });
    }
  }
  return records;
}

export function generateFXData(): FXRate[] {
  const pairs = [
    "UGX/USD", "UGX/EUR", "UGX/GBP", "UGX/KES", "UGX/TZS",
    "UGX/RWF", "UGX/CNY", "UGX/JPY", "USD/EUR", "USD/GBP"
  ];

  return pairs.map(pair => {
    const baseBuy = pair.startsWith("UGX")
      ? randomFloat(3500, 3800)
      : randomFloat(0.8, 1.2);
    const spread = baseBuy * randomFloat(0.01, 0.03);
    return {
      pair,
      buy: parseFloat(baseBuy.toFixed(2)),
      sell: parseFloat((baseBuy + spread).toFixed(2)),
      change: randomFloat(-2.5, 2.5),
      date: new Date().toISOString().split("T")[0],
    };
  });
}

export function generateFXHistory(): FXRate[] {
  const history: FXRate[] = [];
  const pairs = ["UGX/USD", "UGX/EUR", "UGX/GBP", "UGX/KES"];

  for (const pair of pairs) {
    let baseBuy = pair === "UGX/USD" ? 3700 : pair === "UGX/EUR" ? 4000 : pair === "UGX/GBP" ? 4600 : 30;
    for (let d = 30; d >= 0; d--) {
      const date = new Date(2024, 0, 1);
      date.setDate(date.getDate() + d);
      baseBuy += randomFloat(-50, 50);
      const spread = baseBuy * 0.02;
      history.push({
        pair,
        buy: parseFloat(baseBuy.toFixed(2)),
        sell: parseFloat((baseBuy + spread).toFixed(2)),
        change: randomFloat(-2, 2),
        date: date.toISOString().split("T")[0],
      });
    }
  }
  return history;
}

export function generateInclusionData(): InclusionData[] {
  return districts.map(district => {
    const isUrban = ["Kampala", "Wakiso", "Mbarara", "Jinja", "Mbale", "Gulu", "Mukono"].includes(district);
    const pop = isUrban ? randomInt(300000, 1500000) : randomInt(50000, 300000);
    return {
      district,
      accessScore: isUrban ? randomInt(60, 95) : randomInt(20, 65),
      bankBranches: isUrban ? randomInt(5, 45) : randomInt(1, 5),
      agents: isUrban ? randomInt(100, 800) : randomInt(10, 100),
      saccos: isUrban ? randomInt(5, 30) : randomInt(2, 15),
      atms: isUrban ? randomInt(15, 100) : randomInt(1, 10),
      population: pop,
      recommendedAgents: Math.ceil(pop / 2000),
    };
  });
}

export function generateEscrowTransactions(users: User[]): EscrowTransaction[] {
  const transactions: EscrowTransaction[] = [];
  const parentUsers = users.filter(u => u.balance > 100000).slice(0, randomInt(15, 30));

  for (const parent of parentUsers) {
    const numTxns = randomInt(1, 2);
    for (let i = 0; i < numTxns; i++) {
      const statuses: EscrowTransaction["status"][] = ["deposited", "requested", "approved", "released"];
      const statusWeights = [0.3, 0.3, 0.2, 0.2];
      let r = Math.random();
      let status = statuses[0];
      for (let j = 0; j < statuses.length; j++) {
        r -= statusWeights[j];
        if (r <= 0) { status = statuses[j]; break; }
      }

      const deposited = new Date(2024, 0, 1).getTime() + Math.random() * (200 * 24 * 60 * 60 * 1000);
      const requested = status !== "deposited" ? new Date(deposited + randomInt(1, 7) * 24 * 60 * 60 * 1000) : undefined;
      const approved = (status === "approved" || status === "released") && requested
        ? new Date(requested.getTime() + randomInt(1, 3) * 24 * 60 * 60 * 1000) : undefined;
      const released = status === "released" && approved
        ? new Date(approved.getTime() + randomInt(1, 5) * 24 * 60 * 60 * 1000) : undefined;

      transactions.push({
        id: uuid(),
        parentId: parent.id,
        parentName: parent.name,
        parentPhone: parent.phone,
        schoolName: pickRandom(schools),
        studentName: pickRandom(studentNames),
        amount: randomFloat(500000, 5000000),
        status,
        depositedAt: new Date(deposited).toISOString(),
        requestedAt: requested?.toISOString(),
        approvedAt: approved?.toISOString(),
        releasedAt: released?.toISOString(),
      });
    }
  }
  return transactions;
}

export const users = generateUsers();
const smeList = generateSMEs();
export const savingsAccounts = generateSavingsAccounts(users);
export const investments = generateInvestments(users);
export const creditScores = generateCreditScores(users);
export const complaints = generateComplaints(users);
export const fraudAlerts = generateFraudAlerts();
export const smes = smeList;
export const inventory = generateInventory(smeList);
export const cashflowRecords = generateCashflow(smeList);
export const fxRates = generateFXData();
export const inclusionData = generateInclusionData();
export const escrowTransactions = generateEscrowTransactions(users);
