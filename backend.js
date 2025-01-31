const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const svgFixer = require('oslllo-svg-fixer');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors({
    origin: 'https://spinnenzunge.github.io'
}));

const upload = multer({ dest: 'uploads/' });

app.post('/fix-svg', upload.single('file'), async (req, res) => {
    if (!req.file) {
        console.error("No file uploaded");
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const inputFilePath = req.file.path;
        const outputFilePath = `fixed-${req.file.filename}.svg`;

        console.log(`Fixing SVG: ${inputFilePath}`);

        await svgFixer.fix(inputFilePath, outputFilePath);

        console.log(`SVG fixed successfully: ${outputFilePath}`);

        res.download(outputFilePath, 'fixed.svg', (err) => {
            if (err) {
                console.error("Download error:", err);
                res.status(500).json({ error: 'Failed to download file' });
            }
            fs.unlinkSync(inputFilePath);
            fs.unlinkSync(outputFilePath);
        });

    } catch (error) {
        console.error("Error processing SVG:", error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
