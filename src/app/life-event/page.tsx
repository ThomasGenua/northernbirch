import AIFeaturePage from "@/components/AIFeaturePage";

export default function Page() {
  return (
    <AIFeaturePage
      feature="LIFE_EVENT"
      title='Life Event Simulator'
      tag='Life Event Planning'
      description='Major life event coming up? Get a personalized action plan.'
      placeholder="I'm getting married next year and combining finances..."
      color="#D4A547"
      examples={[
        { label: "New Baby", prompt: "We're expecting our first baby in 4 months." },
        { label: "Buying Home", prompt: "We're closing on our first home in 6 weeks." },
        { label: "Retirement", prompt: "I'm retiring next year at 65." }
      ]}
    />
  );
}
