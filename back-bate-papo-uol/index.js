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

    if (!username) {
        res.sendStatus(400)
    } else if (alreadyExists) {
        res.sendStatus(401)
    } else {
        const participant = {
            ...username,
            lastStatus: Date.now()
        }

        const loginMessage = {
            from: participant.name,
            to: 'Todos',
            text: 'entra na sala...', 
            type: 'status', 
            time: getLocalTime()
        }

        participants.push(participant);
        messages.push(loginMessage);
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

app.listen(4000);

function getLocalTime() {
    return new Date().toLocaleString().split(' ')[1]
}