import dynamic from "next/dynamic";

const DynamicAssessmentPage = dynamic(() => import("./client"), { ssr: false });

export default function AssessmentPage() {
  return <DynamicAssessmentPage />;
}
