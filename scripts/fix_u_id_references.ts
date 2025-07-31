import * as fs from 'fs';
import * as path from 'path';

const fixUidReferences = () => {
  const srcDir = path.join(process.cwd(), 'src');
  
  const processFile = (filePath: string) => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let changed = false;
      
      // Fix user?.u_id -> user?.id
      if (content.includes('user?.u_id')) {
        content = content.replace(/user\?\.u_id/g, 'user?.id');
        changed = true;
      }
      
      // Fix user.u_id -> user.id
      if (content.includes('user.u_id')) {
        content = content.replace(/user\.u_id/g, 'user.id');
        changed = true;
      }
      
      // Fix premiumUser?.u_id -> premiumUser?.id
      if (content.includes('premiumUser?.u_id')) {
        content = content.replace(/premiumUser\?\.u_id/g, 'premiumUser?.id');
        changed = true;
      }
      
      // Fix premiumUser.u_id -> premiumUser.id
      if (content.includes('premiumUser.u_id')) {
        content = content.replace(/premiumUser\.u_id/g, 'premiumUser.id');
        changed = true;
      }
      
      // Fix existingUser?.u_id -> existingUser?.id
      if (content.includes('existingUser?.u_id')) {
        content = content.replace(/existingUser\?\.u_id/g, 'existingUser?.id');
        changed = true;
      }
      
      // Fix API calls with u_id parameter -> user_id
      if (content.includes('u_id: user?.u_id')) {
        content = content.replace(/u_id: user\?\.u_id/g, 'user_id: user?.id');
        changed = true;
      }
      
      if (content.includes('u_id: user.u_id')) {
        content = content.replace(/u_id: user\.u_id/g, 'user_id: user.id');
        changed = true;
      }
      
      if (content.includes('u_id: premiumUser?.u_id')) {
        content = content.replace(/u_id: premiumUser\?\.u_id/g, 'user_id: premiumUser?.id');
        changed = true;
      }
      
      if (content.includes('u_id: existingUser?.u_id')) {
        content = content.replace(/u_id: existingUser\?\.u_id/g, 'user_id: existingUser?.id');
        changed = true;
      }
      
      // Fix variable declarations
      if (content.includes('const u_id = user?.u_id')) {
        content = content.replace(/const u_id = user\?\.u_id/g, 'const userId = user?.id');
        changed = true;
      }
      
      if (content.includes('const userId = user?.u_id')) {
        content = content.replace(/const userId = user\?\.u_id/g, 'const userId = user?.id');
        changed = true;
      }
      
      // Fix database queries that still use u_id field
      if (content.includes('.eq("u_id", userId)')) {
        content = content.replace(/\.eq\("u_id", userId\)/g, '.eq("u_id", userId)');
        // Note: We keep u_id for database queries since that's the actual field name in tier2_profiles
      }
      
      if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error);
    }
  };
  
  const walkDir = (dir: string) => {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        processFile(filePath);
      }
    }
  };
  
  walkDir(srcDir);
  console.log('🎉 Finished fixing u_id references!');
};

fixUidReferences(); 