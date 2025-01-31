const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const svgFixer = require('oslllo-svg-fixer');

const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/fix-svg', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const inputFilePath = req.file.path;
        const outputFilePath = `fixed-${req.file.filename}.svg`;

        await svgFixer.fix(inputFilePath, outputFilePath);

        res.download(outputFilePath, 'fixed.svg', (err) => {
            fs.unlinkSync(inputFilePath);
            fs.unlinkSync(outputFilePath);
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process SVG' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
