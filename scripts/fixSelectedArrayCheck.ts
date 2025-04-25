import { Project, SyntaxKind } from "ts-morph";

const project = new Project({
  tsConfigFilePath: "./tsconfig.json",
});

const files = project.getSourceFiles("src/app/premium/assessment/**/*.tsx");

files.forEach((sourceFile) => {
  let didUpdate = false;

  sourceFile.forEachDescendant((node) => {
    if (
      node.getKind() === SyntaxKind.JsxAttribute &&
      node.getFirstChildByKind(SyntaxKind.Identifier)?.getText() === "selected"
    ) {
      const expr = node.getFirstDescendantByKind(SyntaxKind.JsxExpression);
      const innerExpr = expr?.getExpression()?.getText();

      if (
        innerExpr &&
        !innerExpr.includes("Array.isArray") &&
        !innerExpr.startsWith("[") // already safe array literal
      ) {
        expr?.replaceWithText(`{Array.isArray(${innerExpr}) ? ${innerExpr} : []}`);
        didUpdate = true;
      }
    }
  });

  if (didUpdate) {
    console.log(`✅ Fixed: ${sourceFile.getFilePath()}`);
    sourceFile.saveSync();
  }
});
