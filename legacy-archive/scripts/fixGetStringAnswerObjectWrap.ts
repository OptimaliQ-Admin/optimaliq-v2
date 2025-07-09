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
      node.getFirstChildByKind(SyntaxKind.Identifier)?.getText() === "value"
    ) {
      const expr = node.getFirstDescendantByKind(SyntaxKind.JsxExpression);
      const call = expr?.getFirstDescendantByKind(SyntaxKind.CallExpression);

      if (call?.getExpression().getText() === "getStringAnswer") {
        const arg = call.getArguments()[0];
        if (arg?.getKind() === SyntaxKind.ObjectLiteralExpression) {
          const prop = arg.getFirstChildByKind(SyntaxKind.PropertyAssignment);
          const keyName = prop?.getName();

          if (keyName) {
            call.replaceWithText(`getStringAnswer(${keyName})`);
            didUpdate = true;
          }
        }
      }
    }
  });

  if (didUpdate) {
    console.log("✅ Fixed:", sourceFile.getFilePath());
    sourceFile.saveSync();
  }
});
