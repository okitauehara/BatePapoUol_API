import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

let participants = [];
let messages = [];

app.post('/participants', (req, res) => {
    const username = req.body;
    const alreadyExists = participants.find(user => user.name === username.name);

    if (!username.name) {
        res.sendStatus(406)
    } else if (alreadyExists) {
        res.sendStatus(400)
    } else {
        participants.push({
            ...username,
            lastStatus: Date.now()
        });

        messages.push({
            from: username.name,
            to: 'Todos',
            text: 'entra na sala...', 
            type: 'status', 
            time: getLocalTime()
        });

        res.sendStatus(200)
    }
})

app.get('/participants', (req, res) => {
    res.send(participants);
})

app.post('/messages', (req, res) => {
    const username = req.headers.user;
    const message = req.body;

    if (!message.to || !message.text || (message.type !== 'message' && message.type !== 'private_message') || !participants.find(user => user.name === username)) {
        res.sendStatus(400)
    } else {
        messages.push({
            ...message,
            from: username,
            time: getLocalTime()
        });
        res.sendStatus(200);
    }
})

app.get('/messages', (req, res) => {
    const limit = parseInt(req.query.limit);
    const availableMessages = messages.filter(message => message.to === 'Todos' || message.from === req.headers.user );

    if (availableMessages.length <= limit || limit === undefined) {
        res.send(availableMessages);
    } else {
        const limitedMessages = [];
        for (let i = 0; i < limit; i++) {
            limitedMessages.push(availableMessages[i]);
        }
        res.send(limitedMessages);
    }
})

app.post('/status', (req, res) => {
    const username = req.headers.user;

    if (participants.find(user => user.name === username)) {
        participants.map(user => {
            if (user.name === username) {
                user.lastStatus = Date.now();
            }
        })
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
})

app.listen(4000);

function getLocalTime() {
    return new Date().toLocaleString().split(' ')[1]
}