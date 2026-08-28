const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Port-Konfiguration (Standard: 3000 oder über Umgebungsvariable)
const PORT = process.env.PORT || 3000;

// Middleware für JSON-Request-Bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statische Dateien aus dem "public"-Ordner ausliefern (Frontend)
app.use(express.static(path.join(__dirname, 'public')));

// API-Route
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'online', 
        message: 'Server läuft erfolgreich!',
        timestamp: new Date().toISOString() 
    });
});

// Fallback für Single-Page-Applications (kompatibel mit neueren Express-Versionen)
app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server starten
server.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});