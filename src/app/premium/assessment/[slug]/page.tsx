import DynamicAssessmentPage from "./client";

interface Props {
  params?: Promise<{
    slug: string;
  }>;
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  return <>
    {slug && <DynamicAssessmentPage slug={slug} />}
  </>;
}
