const fs = require('fs');
const compiler = require('@babel/core');

const files = [
  'client/src/pages/Login.jsx',
  'client/src/pages/Register.jsx',
  'client/src/components/Navbar.jsx',
  'client/src/components/Footer.jsx',
  'client/src/pages/Home.jsx',
  'client/src/App.jsx'
];

files.forEach(file => {
  try {
    const code = fs.readFileSync(file, 'utf8');
    compiler.transformSync(code, {
      filename: file,
      presets: ['@babel/preset-react']
    });
    console.log(file + ' OK');
  } catch(e) {
    console.error('Error in ' + file + ':', e.message);
  }
});
