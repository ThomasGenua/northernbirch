import AIFeaturePage from "@/components/AIFeaturePage";

export default function Page() {
  return (
    <AIFeaturePage
      feature="HEALTH"
      title='Financial Health Check'
      tag='AI Financial Health'
      description='Get a financial health score with personalized recommendations.'
      placeholder='Tell me about your income, debts, savings, insurance...'
      color="#2E86C1"
      examples={[
        { label: "Quick Check", prompt: "I'm 42, household income $145K, mortgage $420K, RRSP $85K, TFSA $32K, term life $500K." }
      ]}
    />
  );
}
