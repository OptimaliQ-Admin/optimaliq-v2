import { Project, SyntaxKind } from "ts-morph";

const project = new Project({
  tsConfigFilePath: "./tsconfig.json",
});

const files = project.getSourceFiles("src/app/premium/assessment/**/*.tsx");

files.forEach((sourceFile) => {
  let didUpdate = false;

  // Fix `selected={...}`
  sourceFile.forEachDescendant((node) => {
    if (
      node.getKind() === SyntaxKind.JsxAttribute &&
      node.getFirstChildByKind(SyntaxKind.Identifier)?.getText() === "selected"
    ) {
      const initializer = node.getFirstDescendantByKind(SyntaxKind.JsxExpression);
      const expression = initializer?.getExpression();
      const text = expression?.getText() || "";
      if (text && !text.startsWith("getArrayAnswer(")) {
        initializer?.replaceWithText(`{getArrayAnswer(${text})}`);
        didUpdate = true;
      }
    }
  });

  // Fix `.includes(...)` safely
  sourceFile.forEachDescendant((node) => {
    if (node.getKind() === SyntaxKind.CallExpression) {
      const expression = node.getFirstChildByKind(SyntaxKind.PropertyAccessExpression);
      const argList = node.getFirstChildByKind(SyntaxKind.SyntaxList);

      if (expression?.getText().endsWith(".includes") && argList) {
        const arrayExpr = expression.getExpression().getText();
        const fullExpr = node.getText();
        if (!fullExpr.includes("getArrayAnswer")) {
          node.replaceWithText(`getArrayAnswer(${arrayExpr}).includes${fullExpr.slice(arrayExpr.length)}`);
          didUpdate = true;
        }
      }
    }
  });

  if (didUpdate) {
    console.log(`✅ Updated: ${sourceFile.getFilePath()}`);
    sourceFile.saveSync();
  }
});
