export type QuoteType = "TERM_LIFE" | "HOME" | "AUTO" | "TRAVEL" | "CRITICAL_ILLNESS" | "DISABILITY";

export type QuoteInputs = {
  TERM_LIFE: { age: number; coverage: number; term: 10 | 20 | 30; smoker: boolean };
  HOME: { homeValue: number; deductible: 500 | 1000 | 2500 | 5000 };
  AUTO: { vehicleYear: number; drivingRecord: "clean" | "minor" | "major" };
  TRAVEL: { age: number; tripDays: number; travellers: number };
  CRITICAL_ILLNESS: { age: number; coverage: number; smoker: boolean };
  DISABILITY: { age: number; monthlyIncome: number; occupation: "low" | "medium" | "high" };
};

export type QuoteResult = {
  monthlyPremium: number;
  annualPremium: number;
  coverageAmount: number | null;
  details: Record<string, string | number | boolean>;
};

export function calculateQuote<T extends QuoteType>(type: T, inputs: QuoteInputs[T]): QuoteResult {
  switch (type) {
    case "TERM_LIFE": {
      const i = inputs as QuoteInputs["TERM_LIFE"];
      const base = (i.coverage / 1000) * 0.08;
      const ageFactor = 1 + (i.age - 25) * 0.04;
      const termFactor = i.term === 10 ? 0.7 : i.term === 20 ? 1 : 1.4;
      const smokerFactor = i.smoker ? 2.2 : 1;
      const monthly = Math.round(base * ageFactor * termFactor * smokerFactor * 100) / 100;
      return {
        monthlyPremium: monthly,
        annualPremium: Math.round(monthly * 12 * 100) / 100,
        coverageAmount: i.coverage,
        details: { age: i.age, coverage: i.coverage, term: i.term, smoker: i.smoker },
      };
    }
    case "HOME": {
      const i = inputs as QuoteInputs["HOME"];
      const deductFactor = i.deductible === 500 ? 1.15 : i.deductible === 1000 ? 1 : i.deductible === 2500 ? 0.85 : 0.75;
      const monthly = Math.round((i.homeValue * 0.004 / 12) * deductFactor * 100) / 100;
      return {
        monthlyPremium: monthly,
        annualPremium: Math.round(monthly * 12 * 100) / 100,
        coverageAmount: i.homeValue,
        details: { homeValue: i.homeValue, deductible: i.deductible, liability: 2000000 },
      };
    }
    case "AUTO": {
      const i = inputs as QuoteInputs["AUTO"];
      const yearFactor = i.vehicleYear >= 2022 ? 1.2 : i.vehicleYear >= 2018 ? 1 : 0.85;
      const recordFactor = i.drivingRecord === "clean" ? 0.85 : i.drivingRecord === "minor" ? 1 : 1.4;
      const monthly = Math.round(145 * yearFactor * recordFactor * 100) / 100;
      return {
        monthlyPremium: monthly,
        annualPremium: Math.round(monthly * 12 * 100) / 100,
        coverageAmount: 2000000,
        details: { vehicleYear: i.vehicleYear, drivingRecord: i.drivingRecord, liability: 2000000 },
      };
    }
    case "TRAVEL": {
      const i = inputs as QuoteInputs["TRAVEL"];
      const ageFactor = i.age > 65 ? 3.2 : i.age > 50 ? 1.8 : 1;
      const monthly = Math.round(ageFactor * i.tripDays * 0.95 * i.travellers * 100) / 100;
      return {
        monthlyPremium: monthly,
        annualPremium: Math.round(monthly * 12 * 100) / 100,
        coverageAmount: 5000000,
        details: { age: i.age, tripDays: i.tripDays, travellers: i.travellers, medical: 5000000 },
      };
    }
    case "CRITICAL_ILLNESS": {
      const i = inputs as QuoteInputs["CRITICAL_ILLNESS"];
      const base = (i.coverage / 100000) * 35;
      const ageFactor = 1 + (i.age - 30) * 0.05;
      const smokerFactor = i.smoker ? 1.8 : 1;
      const monthly = Math.round(base * ageFactor * smokerFactor * 100) / 100;
      return {
        monthlyPremium: monthly,
        annualPremium: Math.round(monthly * 12 * 100) / 100,
        coverageAmount: i.coverage,
        details: { age: i.age, coverage: i.coverage, conditions: 25, smoker: i.smoker },
      };
    }
    case "DISABILITY": {
      const i = inputs as QuoteInputs["DISABILITY"];
      const occFactor = i.occupation === "low" ? 0.8 : i.occupation === "medium" ? 1 : 1.4;
      const ageFactor = 1 + (i.age - 30) * 0.04;
      const benefit = Math.round(i.monthlyIncome * 0.7);
      const monthly = Math.round(benefit * 0.025 * occFactor * ageFactor * 100) / 100;
      return {
        monthlyPremium: monthly,
        annualPremium: Math.round(monthly * 12 * 100) / 100,
        coverageAmount: benefit,
        details: { age: i.age, monthlyIncome: i.monthlyIncome, occupation: i.occupation, benefit },
      };
    }
    default:
      throw new Error(`Unknown quote type: ${type}`);
  }
}

export function calculateMortgage(amount: number, ratePercent: number, years: number): { monthly: number; totalInterest: number; totalPaid: number } {
  const r = ratePercent / 100 / 12;
  const n = years * 12;
  const monthly = amount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPaid = monthly * n;
  return {
    monthly: Math.round(monthly * 100) / 100,
    totalInterest: Math.round((totalPaid - amount) * 100) / 100,
    totalPaid: Math.round(totalPaid * 100) / 100,
  };
}

export function calculateRetirement(p: {
  currentAge: number; retirementAge: number; currentIncome: number;
  currentSavings: number; monthlyContribution: number; expectedReturn: number;
}) {
  const years = p.retirementAge - p.currentAge;
  const retirementYears = 90 - p.retirementAge;
  const monthlyR = p.expectedReturn / 100 / 12;
  const months = years * 12;
  const fvSaved = p.currentSavings * Math.pow(1 + monthlyR, months);
  const fvContrib = p.monthlyContribution * ((Math.pow(1 + monthlyR, months) - 1) / monthlyR);
  const totalAtRetire = Math.round(fvSaved + fvContrib);
  const annualNeed = p.currentIncome * 0.7;
  const totalNeed = Math.round(annualNeed * retirementYears);
  const cppOasAnnual = 18000;
  const monthlyFromSavings = Math.round((totalAtRetire * 0.04) / 12);
  const monthlyGov = Math.round(cppOasAnnual / 12);
  const monthlyTotal = monthlyFromSavings + monthlyGov;
  const monthlyTarget = Math.round(annualNeed / 12);
  return {
    totalAtRetire, totalNeed, govTotal: cppOasAnnual * retirementYears,
    monthlyFromSavings, monthlyGov, monthlyTotal, monthlyTarget,
    gap: monthlyTarget - monthlyTotal, annualNeed,
    insGap: Math.max(0, totalNeed - totalAtRetire - cppOasAnnual * retirementYears),
    years, retirementYears,
  };
}

export function calculateInsuranceNeeds(income: number, dependents: number, mortgage: number) {
  const incomeReplacement = income * 10;
  const debtCoverage = mortgage;
  const education = dependents * 80000;
  const total = incomeReplacement + debtCoverage + education;
  return { total, incomeReplacement, debtCoverage, education };
}
