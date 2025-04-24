import { Project, SyntaxKind } from "ts-morph";
import path from "path";

// Initialize ts-morph with your tsconfig
const project = new Project({
  tsConfigFilePath: path.resolve("tsconfig.json"),
});

// Find all relevant files
const sourceFiles = project.getSourceFiles("src/**/*.{ts,tsx}");

// Text to add
const importText = `import { getErrorMessage } from "@/utils/errorHandler";`;

sourceFiles.forEach((file) => {
  const fileText = file.getFullText();

  const usesFunction = fileText.includes("getErrorMessage(");
  const alreadyHasImport = fileText.includes(importText);

  if (usesFunction && !alreadyHasImport) {
    const imports = file.getImportDeclarations();
    if (imports.length > 0) {
      // Insert after the last existing import
      const lastImport = imports[imports.length - 1];
      file.insertText(lastImport.getEnd() + 1, `\n${importText}`);
    } else {
      // No imports? Insert at the top
      file.insertText(0, `${importText}\n\n`);
    }
    console.log(`✅ Added to: ${file.getBaseName()}`);
  }
});

// Save all changes
project.save().then(() => {
  console.log("🎉 Done updating files.");
});
