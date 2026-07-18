import AIFeaturePage from "@/components/AIFeaturePage";

export default function Page() {
  return (
    <AIFeaturePage
      feature="TAX"
      title='Tax and Savings Optimizer'
      tag='AI Tax Strategy'
      description='Maximize your RRSP, TFSA, FHSA, and tax-efficient insurance.'
      placeholder="I'm 35, $95K salary, $20K RRSP room, $35K TFSA room."
      color="#E74C3C"
      examples={[
        { label: "RRSP vs TFSA", prompt: 'I have $10K to contribute. Should I put it in RRSP or TFSA?' },
        { label: "FHSA Strategy", prompt: 'I want to buy a home in 3-5 years. How do I use the FHSA?' }
      ]}
    />
  );
}
