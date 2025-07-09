const path = require("path");
const fs = require("fs");
import { Project, SourceFile } from "ts-morph";

const project = new Project({
  tsConfigFilePath: path.resolve("tsconfig.json"),
});

const sourceFiles: SourceFile[] = project.getSourceFiles("src/app/premium/**/*.tsx");

sourceFiles.forEach((file: SourceFile) => {
  const filePath: string = file.getFilePath();
  const originalText: string = file.getFullText();

  const updatedText: string = originalText.replace(
    /value=\{answers\["(.+?)"\] \|\| ""\}/g,
    (_match: string, key: string): string => `value={getStringAnswer(answers["${key}"])}`
  );

  const hasGetString = updatedText.includes("getStringAnswer");
  const hasImport = updatedText.includes('from "@/lib/types/AssessmentAnswers"');

  let finalText = updatedText;
  if (!hasGetString) {
    finalText = `import { getStringAnswer } from "@/lib/types/AssessmentAnswers";\n` + finalText;
  } else if (!hasImport) {
    finalText = `import { getStringAnswer } from "@/lib/types/AssessmentAnswers";\n` + finalText;
  }

  if (finalText !== originalText) {
    fs.writeFileSync(filePath, finalText);
    console.log(`✅ Updated: ${filePath}`);
  }
});
