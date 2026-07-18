const fs = require('fs');
let code = fs.readFileSync('server/src/services/inspectionService.ts', 'utf8');

if (!code.includes('EmailService')) {
  code = code.replace(
    /import mongoose from 'mongoose';/,
    `import mongoose from 'mongoose';\nimport { EmailService } from './emailService';\nimport { userRepository } from '../repositories/userRepository';`
  );
  
  // Update Fine status to send email
  code = code.replace(
    /updateFineStatus: async \(fineId: string, status: string\) => {/,
    `updateFineStatus: async (fineId: string, status: string) => {\n    const fine = await inspectionRepository.updateFineStatus(fineId, status);\n    if (fine) {\n       const user = await userRepository.findById(fine.customerId.toString());\n       if (user) {\n         await EmailService.sendEmail(user.email, \`Fine \${status}\`, \`<h3>Fine Update</h3><p>Your fine of PKR \${fine.amount} for \${fine.reason} is now \${status}.</p>\`);\n       }\n    }\n    return fine;\n  `
  );
  
  code = code.replace(
    /return await inspectionRepository\.updateFineStatus\(fineId, status\);/g,
    `// replaced`
  );
  
  fs.writeFileSync('server/src/services/inspectionService.ts', code);
}
