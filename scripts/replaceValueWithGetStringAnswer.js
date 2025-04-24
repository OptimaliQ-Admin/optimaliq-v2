/**
 * Replaces: value={answers["key"] || ""}
 * With:     value={getStringAnswer(answers["key"])}
 */

export default function transformer(file, api) {
    const j = api.jscodeshift;
    const root = j(file.source);
  
    let didTransform = false;
  
    // Ensure import exists
    const existingImport = root.find(j.ImportDeclaration, {
      source: { value: "@/lib/types/AssessmentAnswers" },
    });
  
    const hasGetStringImport = existingImport.find(j.ImportSpecifier, {
      imported: { name: "getStringAnswer" },
    });
  
    if (existingImport.size() && !hasGetStringImport.size()) {
      existingImport.forEach((path) => {
        path.node.specifiers.push(j.importSpecifier(j.identifier("getStringAnswer")));
      });
    } else if (!existingImport.size()) {
      root.get().node.program.body.unshift(
        j.importDeclaration(
          [j.importSpecifier(j.identifier("getStringAnswer"))],
          j.literal("@/lib/types/AssessmentAnswers")
        )
      );
    }
  
    root.find(j.JSXAttribute, {
      name: { name: "value" },
      value: {
        type: "JSXExpressionContainer",
        expression: {
          type: "LogicalExpression",
          operator: "||",
          left: {
            type: "MemberExpression",
            object: { name: "answers" },
          },
          right: { type: "Literal", value: "" },
        },
      },
    }).forEach((path) => {
      const keyNode = path.value.value.expression.left.property;
  
      const key =
        keyNode.type === "Literal" ? keyNode.raw : `"${keyNode.name || keyNode.value}"`;
  
      path.value.value = j.jsxExpressionContainer(
        j.callExpression(j.identifier("getStringAnswer"), [
          j.memberExpression(j.identifier("answers"), j.literal(key.replace(/"/g, "")), true),
        ])
      );
  
      didTransform = true;
    });
  
    return didTransform ? root.toSource() : null;
  }
  