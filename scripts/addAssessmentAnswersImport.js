export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Check if the import already exists
  const hasImport = root.find(j.ImportDeclaration, {
    source: { value: "@/lib/types/AssessmentAnswers" },
  }).size();

  // Check if AssessmentAnswers is used in the file
  const usesAssessmentAnswers = root.find(j.TSTypeReference, {
    typeName: { name: "AssessmentAnswers" },
  }).size();

  if (!hasImport && usesAssessmentAnswers) {
    const importStatement = j.importDeclaration(
      [j.importSpecifier(j.identifier("AssessmentAnswers"))],
      j.literal("@/lib/types/AssessmentAnswers")
    );
    importStatement.importKind = "type";

    root.get().node.program.body.unshift(importStatement);
    return root.toSource({ quote: "double" });
  }

  return null;
}
