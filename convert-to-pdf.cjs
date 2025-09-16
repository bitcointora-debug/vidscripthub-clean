const markdownpdf = require("markdown-pdf");
const fs = require("fs");
const path = require("path");

// Create public/bonuses directory if it doesn't exist
const publicDir = path.join(__dirname, "public");
const bonusesDir = path.join(publicDir, "bonuses");

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

if (!fs.existsSync(bonusesDir)) {
    fs.mkdirSync(bonusesDir);
}

// PDF conversion options
const options = {
    paperFormat: "A4",
    paperOrientation: "portrait",
    paperBorder: "2cm",
    renderDelay: 1000,
    cssPath: path.join(__dirname, "bonus-styles.css")
};

// Create CSS file for better PDF styling
const cssContent = `
body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    color: #1A0F3C;
    border-bottom: 3px solid #DAFF00;
    padding-bottom: 10px;
}

h2 {
    color: #2A1A5E;
    margin-top: 30px;
}

h3 {
    color: #4A3F7A;
    margin-top: 25px;
}

h4 {
    color: #6B46C1;
    margin-top: 20px;
}

code {
    background-color: #f4f4f4;
    padding: 2px 4px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
}

pre {
    background-color: #f4f4f4;
    padding: 15px;
    border-radius: 5px;
    overflow-x: auto;
}

blockquote {
    border-left: 4px solid #DAFF00;
    margin: 20px 0;
    padding-left: 20px;
    color: #666;
}

table {
    border-collapse: collapse;
    width: 100%;
    margin: 20px 0;
}

th, td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
}

th {
    background-color: #1A0F3C;
    color: white;
}

ul, ol {
    margin: 15px 0;
    padding-left: 30px;
}

li {
    margin: 5px 0;
}

strong {
    color: #1A0F3C;
}

em {
    color: #4A3F7A;
}

hr {
    border: none;
    height: 2px;
    background-color: #DAFF00;
    margin: 30px 0;
}

.page-break {
    page-break-before: always;
}
`;

fs.writeFileSync(path.join(__dirname, "bonus-styles.css"), cssContent);

// Convert each markdown file to PDF
const files = [
    {
        input: "bonuses/Profit-Ready-Niche-Database.md",
        output: "public/bonuses/Profit-Ready-Niche-Database.pdf"
    },
    {
        input: "bonuses/Viral-Monetization-Blueprint.md",
        output: "public/bonuses/Viral-Monetization-Blueprint.pdf"
    },
    {
        input: "bonuses/Ultimate-Viral-Hook-Swipe-File.md",
        output: "public/bonuses/Ultimate-Viral-Hook-Swipe-File.pdf"
    }
];

console.log("Converting markdown files to PDF...");

files.forEach((file, index) => {
    console.log(`Converting ${file.input}...`);
    
    markdownpdf(options).from(file.input).to(file.output, (err) => {
        if (err) {
            console.error(`Error converting ${file.input}:`, err);
        } else {
            console.log(`✅ Successfully converted ${file.input} to ${file.output}`);
        }
        
        // Check if this is the last file
        if (index === files.length - 1) {
            console.log("\n🎉 All PDFs have been created successfully!");
            console.log("PDFs are now available in the public/bonuses/ directory");
        }
    });
});
