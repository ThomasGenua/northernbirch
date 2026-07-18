import AIFeaturePage from "@/components/AIFeaturePage";

export default function Page() {
  return (
    <AIFeaturePage
      feature="ADVISOR"
      title='AI Insurance Advisor'
      tag='AI Advisor'
      description="Tell me about your life situation and I'll recommend the right insurance products."
      placeholder='Describe your situation...'
      color="#8E44AD"
      examples={[
        { label: "First Home", prompt: 'I just bought my first home in Toronto with a $480K mortgage. What insurance do I need?' },
        { label: "New Baby", prompt: 'We just had our first child. What should we be thinking about?' },
        { label: "Self-Employed", prompt: "I'm 32 and self-employed as a consultant. What insurance should I prioritize?" }
      ]}
    />
  );
}
