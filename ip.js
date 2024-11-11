// ip.js
let connectedIps = []; // Ovdje čuvamo sve povezane IP adrese
let messages = []; // Ovdje čuvamo poruke sa pripadajućim IP adresama

module.exports = (app) => {
    // Middleware koji prati dolazne IP adrese i dodaje ih u listu
    app.use((req, res, next) => {
        const ip = req.ip;
        
        // Dodajemo IP adresu ako nije već u listi
        if (!connectedIps.includes(ip)) {
            connectedIps.push(ip);
        }

        // Ako je POST zahtev i ima poruku, dodajemo je u listu sa IP adresom
        if (req.method === 'POST' && req.body.message) {
            messages.push({ ip, message: req.body.message });
        }

        next(); // Nastavljamo sa obradom zahteva
    });

    // Ruta za prikazivanje IP adresa
    app.get('/ip-list', (req, res) => {
        res.json(connectedIps);  // Šaljemo listu IP adresa
    });

    // Ruta za prikazivanje poruka i IP adresa
    app.get('/messages', (req, res) => {
        res.json(messages);  // Šaljemo sve poruke i njihove IP adrese
    });
};
