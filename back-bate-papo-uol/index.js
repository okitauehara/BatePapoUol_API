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
    if (username.name.length === 0) {
        res.status(400)
    } else if (alreadyExists) {
        res.status(401)
    } else {
        const participant = {
            name: username.name,
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
        res.status(200)
    }
})

app.get('/participants', (req, res) => {
    res.send(participants);
})

app.listen(4000);

function getLocalTime() {
    return new Date().toLocaleString().split(' ')[1]
}