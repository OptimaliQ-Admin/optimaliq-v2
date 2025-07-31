#!/usr/bin/env tsx

/**
 * Script to identify and update table references for World Class Onboarding migration
 * 
 * This script helps identify all files that need to be updated to use the new table structure:
 * - tier2_users → users (with u_id → id)
 * - subscriptions.u_id → subscriptions.user_id
 * - onboarding_assessments → onboarding_sessions (with u_id → user_id)
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface TableReference {
  file: string;
  line: number;
  content: string;
  table: string;
  oldField: string;
  newField: string;
  newTable?: string;
}

const MIGRATION_MAP = {
  'tier2_users': {
    newTable: 'users',
    fieldMappings: {
      'u_id': 'id'
    }
  },
  'subscriptions': {
    newTable: 'subscriptions',
    fieldMappings: {
      'u_id': 'user_id'
    }
  },
  'onboarding_assessments': {
    newTable: 'onboarding_sessions',
    fieldMappings: {
      'u_id': 'user_id',
      'o_id': 'id'
    }
  }
};

async function findTableReferences(): Promise<TableReference[]> {
  const references: TableReference[] = [];
  
  // Find all TypeScript and JavaScript files
  const files = await glob('src/**/*.{ts,tsx,js,jsx}', {
    ignore: ['src/**/*.d.ts', 'src/**/node_modules/**', 'src/**/dist/**']
  });

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;

      // Check for table references
      for (const [oldTable, migration] of Object.entries(MIGRATION_MAP)) {
        if (line.includes(oldTable)) {
          references.push({
            file,
            line: lineNumber,
            content: line.trim(),
            table: oldTable,
            oldField: 'u_id', // Default, will be refined
            newField: migration.fieldMappings['u_id'] || 'id',
            newTable: migration.newTable
          });
        }
      }
    }
  }

  return references;
}

function generateMigrationReport(references: TableReference[]): string {
  let report = '# 🔄 TABLE MIGRATION REPORT\n\n';
  
  report += `## 📊 Summary\n`;
  report += `- Total files to update: ${new Set(references.map(r => r.file)).size}\n`;
  report += `- Total references found: ${references.length}\n\n`;

  // Group by table
  const byTable = references.reduce((acc, ref) => {
    if (!acc[ref.table]) acc[ref.table] = [];
    acc[ref.table].push(ref);
    return acc;
  }, {} as Record<string, TableReference[]>);

  for (const [table, refs] of Object.entries(byTable)) {
    const migration = MIGRATION_MAP[table as keyof typeof MIGRATION_MAP];
    report += `## 🔄 ${table} → ${migration.newTable}\n\n`;
    
    // Group by file
    const byFile = refs.reduce((acc, ref) => {
      if (!acc[ref.file]) acc[ref.file] = [];
      acc[ref.file].push(ref);
      return acc;
    }, {} as Record<string, TableReference[]>);

    for (const [file, fileRefs] of Object.entries(byFile)) {
      report += `### 📁 ${file}\n\n`;
      
      for (const ref of fileRefs) {
        report += `**Line ${ref.line}:**\n`;
        report += `\`\`\`typescript\n${ref.content}\n\`\`\`\n`;
        report += `**Needs to become:**\n`;
        report += `\`\`\`typescript\n${ref.content.replace(ref.table, migration.newTable).replace(/u_id/g, migration.fieldMappings['u_id'] || 'id')}\n\`\`\`\n\n`;
      }
    }
  }

  return report;
}

function generateUpdateScript(references: TableReference[]): string {
  let script = '#!/usr/bin/env tsx\n\n';
  script += '/**\n';
  script += ' * Auto-generated script to update table references\n';
  script += ' * Run this script to automatically update all table references\n';
  script += ' */\n\n';
  
  script += 'import fs from \'fs\';\n';
  script += 'import path from \'path\';\n\n';

  // Group by file
  const byFile = references.reduce((acc, ref) => {
    if (!acc[ref.file]) acc[ref.file] = [];
    acc[ref.file].push(ref);
    return acc;
  }, {} as Record<string, TableReference[]>);

  script += 'async function updateFiles() {\n';
  script += '  const updates = [\n';

  for (const [file, refs] of Object.entries(byFile)) {
    script += `    {\n`;
    script += `      file: '${file}',\n`;
    script += `      replacements: [\n`;
    
    for (const ref of refs) {
      const migration = MIGRATION_MAP[ref.table as keyof typeof MIGRATION_MAP];
      const newContent = ref.content
        .replace(ref.table, migration.newTable)
        .replace(/u_id/g, migration.fieldMappings['u_id'] || 'id');
      
      script += `        {\n`;
      script += `          from: ${JSON.stringify(ref.content)},\n`;
      script += `          to: ${JSON.stringify(newContent)}\n`;
      script += `        },\n`;
    }
    
    script += `      ]\n`;
    script += `    },\n`;
  }

  script += '  ];\n\n';
  script += '  for (const update of updates) {\n';
  script += '    try {\n';
  script += '      const content = fs.readFileSync(update.file, \'utf-8\');\n';
  script += '      let newContent = content;\n\n';
  script += '      for (const replacement of update.replacements) {\n';
  script += '        newContent = newContent.replace(replacement.from, replacement.to);\n';
  script += '      }\n\n';
  script += '      if (newContent !== content) {\n';
  script += '        fs.writeFileSync(update.file, newContent, \'utf-8\');\n';
  script += '        console.log(`✅ Updated ${update.file}`);\n';
  script += '      } else {\n';
  script += '        console.log(`⏭️  No changes needed for ${update.file}`);\n';
  script += '      }\n';
  script += '    } catch (error) {\n';
  script += '      console.error(`❌ Error updating ${update.file}:`, error);\n';
  script += '    }\n';
  script += '  }\n';
  script += '}\n\n';
  script += 'updateFiles().catch(console.error);\n';

  return script;
}

async function main() {
  console.log('🔍 Scanning for table references...');
  const references = await findTableReferences();
  
  console.log(`📊 Found ${references.length} references in ${new Set(references.map(r => r.file)).size} files`);
  
  // Generate report
  const report = generateMigrationReport(references);
  fs.writeFileSync('TABLE_MIGRATION_REPORT.md', report);
  console.log('📄 Generated TABLE_MIGRATION_REPORT.md');
  
  // Generate update script
  const updateScript = generateUpdateScript(references);
  fs.writeFileSync('scripts/auto_update_tables.ts', updateScript);
  console.log('📄 Generated scripts/auto_update_tables.ts');
  
  console.log('\n🎯 Next steps:');
  console.log('1. Review TABLE_MIGRATION_REPORT.md');
  console.log('2. Run: tsx scripts/auto_update_tables.ts');
  console.log('3. Test the application thoroughly');
  console.log('4. Remove legacy tables after confirming everything works');
}

main().catch(console.error); 