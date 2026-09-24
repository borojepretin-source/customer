const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '.env.local');
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/Boro Photo Booth/g, 'Sesijepret Photo Booth');
  fs.writeFileSync(file, content, 'utf8');
}
