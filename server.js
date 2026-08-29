const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API-Route für den Status
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'online', 
        message: 'Server läuft erfolgreich!',
        timestamp: new Date().toISOString() 
    });
});

// NEU: Telegram-Push-Benachrichtigung (Diskret im Hintergrund)
app.post('/api/notify', async (req, res) => {
    const { sender } = req.body;
    
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const ER_CHAT_ID = process.env.ER_CHAT_ID;
    const SIE_CHAT_ID = process.env.SIE_CHAT_ID;

    // Wenn Er sendet, kriegt Sie die Notification, und umgekehrt
    const targetChatId = sender === 'Er' ? SIE_CHAT_ID : ER_CHAT_ID;

    if (!BOT_TOKEN || !targetChatId) {
        // Wenn Token/IDs noch nicht hinterlegt sind, fangen wir es ab, damit die App nicht crasht
        return res.json({ success: false, message: 'Telegram nicht konfiguriert.' });
    }

    // Absolut diskreter Text auf dem Sperrbildschirm (nur ein Emoji)
    const discreetMessage = "☕"; 

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: targetChatId,
                text: discreetMessage
            })
        });
        const data = await response.json();
        if (data.ok) {
            res.json({ success: true });
        } else {
            res.status(500).json({ success: false, error: data });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});