const fs = require('fs');
const path = 'c:/Users/User/Downloads/Coding/jurnal-ai/style.css';
const content = fs.readFileSync(path, 'utf8');

// The Pink Theme refinement based on user's feedback
// Backgrounds from user image: #E19AAA, #E4ACB7, #ECBDC4, #EFC7D4, #F3DCE0
const pinkRefinement = `
/* Pink Theme (Rose/Sakura) */
[data-color="pink"] {
    --primary: #ec4899;
    --accent-primary: #f472b6;
    --accent-secondary: #f9a8d4;
    --accent-glow: rgba(236, 72, 153, 0.15);
    --gradient-primary: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
}

/* Specific Background Overrides for Pink Theme */
/* Text is kept standard (dark/light) while only background is pink */
[data-theme="light"][data-color="pink"] {
    --bg-primary: #f3dce0; /* Ultra soft pink from user image */
    --bg-secondary: #efc7d4; /* Soft pink from user image */
    --bg-card: rgba(255, 255, 255, 0.85);
    --border: rgba(225, 29, 72, 0.1);
    --text-primary: #0f172a; /* Standard dark text (not pink) */
    --text-secondary: #334155; /* Standard dark text (not pink) */
}

[data-theme="dark"][data-color="pink"] {
    --bg-primary: #1a0b10; /* Deep Rose-Black */
    --bg-secondary: #000000;
    --bg-card: rgba(45, 20, 25, 0.7);
    --border: rgba(236, 72, 153, 0.1);
    --text-primary: #f8fafc; /* Standard light text (not pink) */
    --text-secondary: #cbd5e1; /* Standard light text (not pink) */
}
`;

// Find the old pink block and replace it
const oldPinkBlock = /\/\* Pink Theme \(Rose\/Sakura\) \*\/[\s\S]*?\}\s*\[data-theme="dark"\]\[data-color="pink"\] \{[\s\S]*?\}/;
const newContent = content.replace(oldPinkBlock, pinkRefinement);

fs.writeFileSync(path, newContent, 'utf8');
console.log('Successfully adjusted Pink theme: Pink background, standard text colors.');
