const fs = require('fs');
const path = require('path');

const replacements = [
  { search: /Boro Photo Booth/g, replace: 'Sesijepret Photo Booth' },
  { search: /Boro Picture/g, replace: 'Sesijepret' },
  { search: /Pelanggan Boro/g, replace: 'Pelanggan Sesijepret' },
  { search: /Boro Jepret Logo/g, replace: 'Sesijepret Logo' },
  { search: /BoroPicture_/g, replace: 'Sesijepret_' },
];

const filesToUpdate = [
  'constants/app_constants.ts',
  'app/layout.tsx',
  'app/page.tsx',
  'app/thank-you/page.tsx',
  'components/layout/Footer.tsx',
  'components/layout/Header.tsx',
  'services/email_service.ts',
  'models/settings_model.ts',
  'app/api/send-email/route.ts',
  'functions/src/index.ts'
];

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    replacements.forEach(({ search, replace }) => {
      content = content.replace(search, replace);
    });
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated ' + file);
    }
  }
});
