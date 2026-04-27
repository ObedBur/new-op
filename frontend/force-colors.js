const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const colorRegex = /(text|bg|border|ring|shadow|fill|stroke)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(\d{2,3})/g;

// Map tailwind colors to our 4 themes:
// primary (orange), secondary (green), black, white
function getReplacement(prefix, color, shade) {
    const isDark = parseInt(shade) >= 500;
    
    // Grays
    if (['slate', 'gray', 'zinc', 'neutral', 'stone'].includes(color)) {
        if (prefix === 'text') return isDark ? 'text-black dark:text-white' : 'text-black/60 dark:text-white/60';
        if (prefix === 'bg') return isDark ? 'bg-black dark:bg-white' : 'bg-white dark:bg-black';
        if (prefix === 'border') return 'border-black/20 dark:border-white/20';
        return `${prefix}-black dark:${prefix}-white`;
    }
    
    // Warm / Alert colors -> Orange (primary)
    if (['red', 'orange', 'amber', 'yellow', 'rose', 'pink', 'fuchsia'].includes(color)) {
        if (prefix === 'text') return isDark ? 'text-primary' : 'text-primary/70';
        if (prefix === 'bg') return isDark ? 'bg-primary' : 'bg-primary/10';
        if (prefix === 'border') return 'border-primary/50';
        return `${prefix}-primary`;
    }
    
    // Cool / Trust colors -> Green (secondary)
    if (['green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'lime'].includes(color)) {
        if (prefix === 'text') return isDark ? 'text-secondary' : 'text-secondary/70';
        if (prefix === 'bg') return isDark ? 'bg-secondary' : 'bg-secondary/10';
        if (prefix === 'border') return 'border-secondary/50';
        return `${prefix}-secondary`;
    }

    return `${prefix}-${color}-${shade}`; // Fallback
}

let modifiedFiles = 0;

walkDir(directoryPath, function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    
    const newContent = originalContent.replace(colorRegex, (match, prefix, color, shade) => {
        return getReplacement(prefix, color, shade);
    });

    // Also replace hardcoded hex colors that might be left
    const hexContent = newContent
        .replace(/text-\[#(?:[0-9a-fA-F]{3}){1,2}\]/g, 'text-black dark:text-white')
        .replace(/bg-\[#(?:[0-9a-fA-F]{3}){1,2}\]/g, 'bg-white dark:bg-black')
        .replace(/border-\[#(?:[0-9a-fA-F]{3}){1,2}\]/g, 'border-black/20 dark:border-white/20');

    if (originalContent !== hexContent) {
      fs.writeFileSync(filePath, hexContent, 'utf8');
      modifiedFiles++;
      console.log(`Modified: ${filePath}`);
    }
  }
});

console.log(`\nFinished! Modified ${modifiedFiles} files to strictly use the 4-color palette.`);
