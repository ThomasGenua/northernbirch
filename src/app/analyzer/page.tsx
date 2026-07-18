import AIFeaturePage from "@/components/AIFeaturePage";

export default function Page() {
  return (
    <AIFeaturePage
      feature="ANALYZER"
      title='Coverage Gap Analyzer'
      tag='AI Coverage Analysis'
      description="Describe your current insurance and I'll find the gaps."
      placeholder='I have $250K term life through work and home insurance through TD...'
      color="#27AE60"
      examples={[
        { label: "Compare Mine", prompt: "I'm 38, married, two kids, $850K mortgage. I have $500K term life and home insurance only." }
      ]}
    />
  );
}
