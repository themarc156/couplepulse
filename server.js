const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');

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

// LOOKUP-TABELLE FÜR PRÄGNANTE DEUTSCHE TITEL & BESCHREIBUNGEN
const POSITIONS_META = {
    // Oral
    "image_010 (3).png": { title: "Stehender Blowjob 👅", desc: "Er steht aufrecht, während sie seinen Schwanz mit Mund und Händen verwöhnt." },
    "image_012 (2).png": { title: "Cunnilingus im Stehen 👑", desc: "Sie steht aufrecht, er kniet vor ihr und verwöhnt ihre Lustperle mit seiner Zunge." },
    "image_012.png": { title: "Bettkanten-Blowjob 👅", desc: "Er kniet auf dem Bett, sie davor am Boden für intensiven Zungeneinsatz." },
    "image_013 (2).png": { title: "Boden-Cunnilingus 🌸", desc: "Sie sitzt am Boden zwischen seinen Beinen für hingebungsvolles Verwöhnen." },
    "image_013.png": { title: "Tiefes Cunnilingus 🌸", desc: "Ihre Beine sind weit geöffnet und über seine Schultern gelegt." },
    "image_019.png": { title: "Face-Sitting 👑", desc: "Sie sitzt auf seinem Gesicht und bestimmt Druck und Rhythmus völlig frei." },
    "image_022 (2).png": { title: "Sessel-Blowjob 🪑", desc: "Er lehnt entspannt im Stuhl zurück, sie kniet davor und nimmt ihn tief auf." },
    "image_022.png": { title: "Seitlicher Bett-Blowjob 💋", desc: "Er liegt entspannt auf dem Bett, sie kniet seitlich daneben." },
    "image_023.png": { title: "Stuhl-Cunnilingus 👅", desc: "Sie thront auf dem Stuhl, er kniet davor und konzentriert sich voll auf ihre Klitoris." },
    "image_029 (4).png": { title: "Boden-Face-Sitting 👑", desc: "Er liegt am Boden, sie kniet über seinem Kopf für maximale Klitoris-Reibung." },
    "image_029.png": { title: "Stehende Hingabe 👅", desc: "Er steht aufrecht und genießt, während sie seinen Schaft mit den Lippen umschließt." },
    "image_030.png": { title: "Invertierter Blowjob 👅", desc: "Seine Beine sind in der Luft – sie hat vollen Zugang zu Schwanz und Hoden." },
    
    // Von hinten
    "image_002.png": { title: "Flaches Löffelchen 🥄", desc: "Bequemes, enges Aneinanderschmiegen von hinten für sanfte, tiefe Stöße." },
    "image_008.png": { title: "Enges Kuschel-Löffelchen 💑", desc: "Sehr intime Löffelvariante für lange, zärtliche Zweisamkeit." },
    "image_012.png": { title: "Reverse Cowgirl 🍑", desc: "Sie sitzt mit dem Rücken zu ihm auf seinem Schoß und steuert Rhythmus und Tiefe." },
    "image_013 (2).png": { title: "Kniender Stuhl-Doggy 🪑", desc: "Sie kniet auf dem Stuhl nach vorne gebeugt, er steht aufrecht dahinter." },
    "image_013 (3).png": { title: "Stuhl-Doggy 🪑", desc: "Sie stützt sich auf einen Stuhl, er steht aufrecht dahinter für kraftvolle Stöße." },
    "image_015.png": { title: "Sofa-Doggy 🛋️", desc: "Er kniet vor dem Sofa, sie bietet sich erhöht auf den Kissen an." },
    "image_017 (2).png": { title: "Sessel-Ritt (Rückwärts) 🪑", desc: "Er sitzt im Sessel, sie reitet ihn rückwärts mit durchgedrücktem Rücken." },
    "image_017.png": { title: "Flacher Doggy (Prone Bone) 🐾", desc: "Sie liegt flach auf dem Bauch, er legt sich von hinten eng auf sie." },
    "image_020 (2) (2).png": { title: "Der Jockey 🏇", desc: "Er stützt sich auf alle viere, sie reitet aufrecht auf seinem Rücken." },
    "image_025 (2).png": { title: "Kanten-Ritt (Rückwärts) 🍑", desc: "Sie sitzt mit den Füßen am Boden rücklings auf seinem Schoß an der Bettkante." },
    "image_028.png": { title: "Flache Seitenlage 🌊", desc: "Entspannte Seitenlage für ruhige, tiefe Schwingungen und Streicheleinheiten." },
    "image_029.png": { title: "Kniende Umarmung 🫂", desc: "Beide knien eng aneinandergeschmiegt von hinten, er umfasst ihre Brust." },
    "image_030.png": { title: "Sofalehnen-Doggy 🛋️", desc: "Sie legt den Oberkörper über die Sofalehne, er steht dahinter." },
    "image_032 (2).png": { title: "Die Verbeugung 🙇‍♀️", desc: "Ihr Becken ist angehoben und der Kopf liegt tief für tiefen G-Punkt-Reiz." },
    "image_032.png": { title: "Bettkanten-Einstieg 🛏️", desc: "Sie liegt flach auf der Matratze, ein Bein geöffnet – er steht an der Kante." },
    "image_033 (2).png": { title: "Fixierter Prone Bone ⛓️", desc: "Er hält ihre Hände sanft auf dem Rücken fixiert und führt die Stöße von oben." },
    "image_034.png": { title: "Tischkanten-Rausch 🪑", desc: "Sie liegt erhöht auf dem Tisch, er steht aufrecht dahinter für tiefen Einstieg." },
    "image_036.png": { title: "Erhöhter Doggy 🐾", desc: "Sie kniet an der Bettkante mit durchgedrücktem Rücken, er führt ihre Hüften." },
    "image_037 (2).png": { title: "Stuhl-Stand 🪑", desc: "Ein Bein ruht auf dem Stuhl, das andere hält er angehoben." },
    "image_043.png": { title: "Tisch-Flirt 🪑", desc: "Sie stützt sich mit einem Knie auf dem Tisch ab, er steht dahinter." },
    "image_046 (2).png": { title: "Flache Verschmelzung 🛌", desc: "Beide liegen flach ausgestreckt für sanftes, rhythmisches Reiben." },
    "image_046.png": { title: "Rücklings-Knie-Ritt 🐾", desc: "Sie kniet mit dem Rücken zu ihm auf allen vieren über seinen Oberschenkeln." },
    "image_048.png": { title: "Aufsitz-Doggy 🐾", desc: "Sie liegt flach und hebt die Brust leicht an, er kniet aufrecht dahinter." },
    "image_049 (2).png": { title: "Kissen-Bogen 🧘‍♀️", desc: "Ein Kissen unter ihrem Becken kippt den Winkel perfekt für intensive Reibung." },
    "image_051 (3).png": { title: "Aufrechte Knie-Umarmung 🫂", desc: "Beide knien aufrecht hintereinander mit freier Hand für zärtliche Küsse." },
    "image_051.png": { title: "Die Schubkarre 🤸‍♀️", desc: "Er hält ihre Beine angehoben, während sie sich über die Lehne stützt." },
    "image_056.png": { title: "Couchlehnen-Knie-Doggy 🛋️", desc: "Beide knien auf der Sitzfläche, sie stützt sich an der Rückenlehne ab." },
    "image_057 (3).png": { title: "Stehende Verbeugung 🚪", desc: "Sie beugt sich stehend tief nach vorne, er führt ihre Hände von hinten." },
    "image_061.png": { title: "Kissen-Prone-Bone 🧘‍♀️", desc: "Ein Kissen hebt ihre Hüfte an, während er sich flach auf ihren Rücken legt." },
    "image_062 (2).png": { title: "Die Sphinx 🐾", desc: "Sie stützt die Unterarme auf, er liegt flach auf ihrem Rücken und küsst ihren Nacken." },

    // Von vorne
    "image_002 (2).png": { title: "Erhöhter Missionar 🛋️", desc: "Er sitzt halb aufrecht und führt ihre Beine, während sie entspannt liegt." },
    "image_003.png": { title: "Der Kniebeuger 🐾", desc: "Seine angezogenen Knie bieten ihr Halt und erzeugen einen tiefen Einstiegswinkel." },
    "image_004 (2).png": { title: "Aufrechte Reiterin 👑", desc: "Sie hat die volle Kontrolle über Rhythmus, Tiefe und Reibung mit Blickkontakt." },
    "image_005 (3).png": { title: "Inniger Missionar 💋", desc: "Maximaler Haut- und Lippenkontakt bei langsamen, gefühlvollen Bewegungen." },
    "image_007 (4).png": { title: "Der Turm 🗼", desc: "Seine Beine sind aufgerichtet, sie sitzt aufrecht und nutzt ihr Eigengewicht." },
    "image_008 (4).png": { title: "Die Schere ✂️", desc: "Seitliche Missionar-Variante für mühelose, kreisende Beckenbewegungen." },
    "image_009 (2).png": { title: "Gekippter Schmetterling 🦋", desc: "Ihre angewinkelten Beine verengen den Eingang für intensive G-Punkt-Stimulation." },
    "image_009.png": { title: "Der Frosch 🐸", desc: "Er hockt über ihrem Becken, sie zieht die Beine hoch für tiefe Stöße." },
    "image_012 (4).png": { title: "Sofa-Rausch 🛋️", desc: "Die Couch-Polsterung ermöglicht einen besonders weichen, tiefen Einstiegswinkel." },
    "image_014 (3).png": { title: "CAT-Methode 💫", desc: "Flache Schambein-Reibung bei jedem Stoß – ideal für den gemeinsamen Orgasmus." },
    "image_017.png": { title: "Verschlungene Schere ✂️", desc: "Seitliche Verschlingung mit optimaler Stimulation der vorderen Scheidenwand." },
    "image_020 (2).png": { title: "Stehende Reiterin 🚪", desc: "Er liegt auf dem Bett, sie steht über ihm für rhythmische Auf- und Abbewegungen." },
    "image_020.png": { title: "Bettkanten-Reiterin 🛏️", desc: "Sie sitzt aufrecht über seinem Becken mit Beinen am Boden und steuert Tempo und Andruck." },
    "image_022 (3).png": { title: "Die Lotus-Mission 🌸", desc: "Ihre Beine umschlingen seine Hüften eng für maximalen Druck und Hautkontakt." },
    "image_028 (3).png": { title: "Verschmelzung 💋", desc: "Beide liegen flach aufeinander für tiefes Eintauchen und Küsse am ganzen Körper." },
    "image_030.png": { title: "Gekippte Andockung 🦋", desc: "Ihre angewinkelten Knie verengen den Eingang und intensivieren jeden Stoß." },
    "image_032.png": { title: "Bettkanten-Missionar 🛏️", desc: "Er steht vor dem Bett, sie liegt erhöht auf der Matratze für tiefe Führung." },
    "image_037.png": { title: "Sinnliche Reiterin 👑", desc: "Er liegt ausgestreckt und fasst ihren Körper an, während sie aufrecht kreist." },
    "image_038 (2).png": { title: "Couch-Reiterin 🛋️", desc: "Sie reitet ihn auf dem Sofa mit einem Bein am Boden für kraftvollen Schwung." },
    "image_038 (3).png": { title: "Kniender Lotus 🌸", desc: "Beide knien aufrecht aufeinander zu – maximaler Körperkontakt und Küsse." },
    "image_039.png": { title: "Tischkanten-Umarmung 🪑", desc: "Sie sitzt auf dem Tisch und schlingt die Beine um seine Hüfte im Stehen." },
    "image_041.png": { title: "Die Kerze 🕯️", desc: "Ihre Beine sind senkrecht nach oben gestreckt für maximale Enge." },
    "image_042 (2).png": { title: "Die Schranke 📐", desc: "Er führt eines ihrer Beine senkrecht nach oben für gezielten G-Punkt-Druck." },
    "image_045.png": { title: "Couch-Schranke 🛋️", desc: "Sie liegt auf der Couch, er steht davor und führt ihr Bein steil nach oben." },
    "image_047.png": { title: "Die Domina-Reiterin 👑", desc: "Sie sitzt weit oben auf seinem Körper und bestimmt Rhythmus und Reibung autonom." },
    "image_048 (2).png": { title: "Die Diagonale 💫", desc: "Halbe Seitwärtsdrehung mit versetzten Beinen für kontinuierliche Klitoris-Reibung." },
    "image_051 (2).png": { title: "Bettkanten-Schoßsitz 🛏️", desc: "Beide sitzen an der Bettkante, sie lehnt sich zurück und er küsst ihren Hals." },
    "image_051.png": { title: "Diagonaler Schmetterling 🦋", desc: "Diagonale Liegeposition mit hochgezogenen Beinen für tiefen Druckpunkt." },
    "image_053.png": { title: "Armlehnen-Hebel 🛋️", desc: "Ihr Becken ruht erhöht auf der Armlehne, er steht davor und hält ihre Beine." },
    "image_057.png": { title: "Zärtliche Verschmelzung 💋", desc: "Maximaler Hautkontakt bei ruhigen Bewegungen und innigen Küssen." },
    "image_062.png": { title: "Bettkanten-Hocke 🛏️", desc: "Ihre Knie sind ganz zur Brust gezogen, er steht davor und dringt senkrecht ein." },

    // Sonstige
    "image_007.png": { title: "Die Brücke 🌉", desc: "Sie liegt rücklings auf seinem Körper – voller Hautkontakt und Rückbeuge." },
    "image_010 (2).png": { title: "Der Jockey 🏇", desc: "Er stützt sich auf alle viere, sie sitzt aufrecht auf seinem Rücken." },
    "image_010.png": { title: "Rücken-an-Bauch 🌊", desc: "Ungewöhnliche Liegeposition mit engem Kontakt und neuen Reibungswinkeln." },
    "image_012.png": { title: "Herz-an-Herz 🫂", desc: "Sehr sinnliche, ruhige Liegeposition mit engem Kontakt der Oberkörper." },
    "image_019 (3).png": { title: "Flache Andockung 🌊", desc: "Flache Liegeposition für ruhige, kreisende Beckenbewegungen." },
    "image_024 (3).png": { title: "Sinnliche Umarmung 🫂", desc: "Ruhig, intim und gefühlvoll – ideal zum Innehalten und Genießen." },
    "image_025.png": { title: "Stehender Flamingo 🚪", desc: "Im Stehen: Er hebt ein Bein von ihr an seiner Hüfte hoch für spontanen Einstieg." },
    "image_037 (5).png": { title: "Sofa-Flanke 🛋️", desc: "Sie liegt quer auf der Couch, er kniet davor und dringt sanft von der Seite ein." },
    "image_038 (3).png": { title: "Der Schoß-Thron 🪑", desc: "Beide sitzen aufrecht im Stuhl in die gleiche Richtung – er liebkost ihre Brust." },
    "image_044 (2).png": { title: "Tisch-Schoßsitz 🪑", desc: "Er sitzt am Tisch, sie sitzt rittlings auf seinem Schoß und stützt sich ab." },
    "image_044 (3).png": { title: "Tisch-Brücke 🪑", desc: "Er liegt auf dem Tisch, sie sitzt auf ihm und stützt sich am Stuhl davor ab." },
    "image_051 (4).png": { title: "Ball-Brücke 🧘‍♀️", desc: "Ihr Rücken federt auf dem Gymnastikball, er steht zwischen ihren Beinen." },
    "image_054 (2).png": { title: "Stehende Verschmelzung 🪑", desc: "Sie sitzt auf dem Stuhl, er steht eng davor mit ihren Beinen um seine Hüfte." }
};

// NEU: Automatischer Scanner für alle Stellungs-Bilder und Unterordner mit Lookup
app.get('/api/positions', (req, res) => {
    let baseDir = path.join(__dirname, 'public', 'images', 'positions');
    let webPrefix = '/images/positions';

    if (!fs.existsSync(baseDir)) {
        baseDir = path.join(__dirname, 'public', 'image', 'positions');
        webPrefix = '/image/positions';
    }

    if (!fs.existsSync(baseDir)) {
        return res.json([]);
    }

    const positions = [];
    const validExts = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];

    function scanDirectory(currentPath, currentCategory) {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);
            if (entry.isDirectory()) {
                scanDirectory(fullPath, entry.name);
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name).toLowerCase();
                if (validExts.includes(ext)) {
                    const rawFileName = entry.name;
                    const meta = POSITIONS_META[rawFileName] || null;

                    let finalTitle = '';
                    let finalDesc = '';

                    if (meta) {
                        finalTitle = meta.title;
                        finalDesc = meta.desc || '';
                    } else {
                        // Fallback: Saubere Formatierung des Dateinamens
                        finalTitle = path.parse(rawFileName).name
                            .replace(/\.sync-conflict-[^.]+/g, '')
                            .replace(/[()]/g, '')
                            .replace(/[_-]/g, ' ')
                            .replace(/\s+/g, ' ')
                            .trim()
                            .replace(/\b\w/g, char => char.toUpperCase());
                    }

                    const categoryUrl = currentCategory ? encodeURIComponent(currentCategory) + '/' : '';
                    const filenameUrl = encodeURIComponent(rawFileName);
                    const relativeWebPath = `${webPrefix}/${categoryUrl}${filenameUrl}`;
                    
                    const safeId = `pos_${(currentCategory ? currentCategory + '_' : '') + rawFileName}`.replace(/[^a-zA-Z0-9_]/g, '_');

                    positions.push({
                        id: safeId,
                        category: currentCategory || 'allgemein',
                        rawFile: rawFileName,
                        title: finalTitle,
                        desc: finalDesc,
                        image: relativeWebPath
                    });
                }
            }
        }
    }

    try {
        scanDirectory(baseDir, '');
        res.json(positions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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