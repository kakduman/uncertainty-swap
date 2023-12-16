const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Create submissions directory if it doesn't exist
const submissionsDir = './submissions';
if (!fs.existsSync(submissionsDir)){
    fs.mkdirSync(submissionsDir, { recursive: true });
}

app.use(express.static('public'));
app.use(express.json());

app.post('/submit', (req, res) => {
    const idea = req.body.idea;
    const filename = `submissions/${Date.now()}.txt`;
    fs.writeFile(filename, idea, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error saving the idea' });
        }
        res.send({ message: 'Idea submitted successfully' });
    });
});

app.get('/random', (req, res) => {
    fs.readdir('submissions', (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error reading submissions' });
        }
        const randomFile = files[Math.floor(Math.random() * files.length)];
        fs.readFile(`submissions/${randomFile}`, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ message: 'Error reading idea' });
            }
            res.send({ idea: data });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
