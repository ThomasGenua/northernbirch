import AIFeaturePage from "@/components/AIFeaturePage";

export default function Page() {
  return (
    <AIFeaturePage
      feature="DOC_READER"
      title='Policy Document Reader'
      tag='AI Document Analysis'
      description="Paste your existing insurance policy text and I'll analyze it."
      placeholder='Paste your insurance policy text here...'
      color="#1B2A4A"
    />
  );
}
