const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const configPath = 'base-bridge-tx.json';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function runSendPacketCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                reject(error);
            } else {
                console.log(stdout);
                resolve(true);
            }
        });
    });
}

app.post('/execute-command', (req, res) => {
    const command = req.body.command;

    runSendPacketCommand(command)
        .then((result) => {
            const configData = fs.readFileSync(configPath, 'utf8');
            const config = JSON.parse(configData);
            const url = config.content;
            res.send(url);
        })
        .catch((error) => {
            res.status(500).send('Internal Server Error');
        });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});



