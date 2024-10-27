// Prati prisustvo DJ-a (Radio Galaksija)
let isDJ = (currentUser.username === 'Radio Galaksija');
let pvEnabled = false;  // Privatne poruke su isključene po defaultu
let selectedUserId = null;  // ID korisnika kojeg će DJ banovati

// Funkcija za prikaz kontekstualnog menija po desnom kliku u sredini chata
document.getElementById('chatArea').addEventListener('contextmenu', function(e) {
    e.preventDefault();
    if (isDJ) {
        // Prikaži kontrolnu tablu sa opcijama samo za DJ-a
        showControlPanel(e.pageX, e.pageY);
    }
});

// Funkcija za prikaz kontrolne table sa opcijama
function showControlPanel(x, y) {
    let panel = document.createElement('div');
    panel.id = 'controlPanel';
    panel.style.position = 'absolute';
    panel.style.top = y + 'px';
    panel.style.left = x + 'px';
    panel.style.backgroundColor = 'black';
    panel.style.color = 'white';
    panel.style.padding = '10px';
    panel.style.borderRadius = '5px';
    panel.innerHTML = `
        <p id="clearChat">Obriši chat</p>
        <p id="togglePV">${pvEnabled ? 'Isključi PV' : 'Uključi PV za sve'}</p>
        <p id="selectBanUser">Selektuj korisnika za ban</p>
        <p id="takeOver">Take Over</p>
    `;
    document.body.appendChild(panel);

    // Funkcija za brisanje chata
    document.getElementById('clearChat').addEventListener('click', function() {
        if (confirm('Da li ste sigurni da želite obrisati chat?')) {
            socket.emit('clearChat'); // Emituj događaj za brisanje chata
            alert('Chat je obrisan.');
        }
        panel.remove(); // Ukloni panel nakon akcije
    });

    // Funkcija za uključivanje ili isključivanje PV
    document.getElementById('togglePV').addEventListener('click', function() {
        pvEnabled = !pvEnabled;
        socket.emit('togglePV', pvEnabled); // Emituj događaj sa stanjem PV
        alert(`PV za sve je sada ${pvEnabled ? 'uključen' : 'isključen'}.`);
        panel.remove(); // Ukloni panel nakon akcije
    });

    // Funkcija za selektovanje korisnika za ban
    document.getElementById('selectBanUser').addEventListener('click', function() {
        alert('Dva puta kliknite na korisnika u listi da biste ga banovali.');
        panel.remove(); // Ukloni panel nakon akcije
    });

    // Funkcija za take over (preuzimanje kontrole)
    document.getElementById('takeOver').addEventListener('click', function() {
        socket.emit('takeOver'); // Emituj događaj za take over
        alert('Preuzeli ste kontrolu nad radiom.');
        panel.remove(); // Ukloni panel nakon akcije
    });
}

// Banovanje korisnika na dva klika
let clickTimeout;
document.getElementById('guestList').addEventListener('click', function(e) {
    let targetUser = e.target;  // Korisničko ime kliknuto u listi gostiju
    if (clickTimeout) {
        clearTimeout(clickTimeout);
        selectedUserId = targetUser.dataset.userId;  // Sačuvaj ID selektovanog korisnika
        banUser(selectedUserId);
    } else {
        clickTimeout = setTimeout(() => { clickTimeout = null; }, 300);  // Resetovanje dvostrukog klika
    }
});

// Banovanje selektovanog korisnika
function banUser(userId) {
    if (isDJ && userId) {
        socket.emit('banUser', userId); // Emituj događaj za ban
        alert(`Korisnik sa ID-jem ${userId} je banovan.`);
    }
}

// Kada nov gost dođe
socket.on('newGuest', function (nickname) {
    const guestList = document.getElementById('guestList');
    const newGuest = document.createElement('div');
    newGuest.className = 'guest'; // Dodaj klasu 'guest'
    newGuest.textContent = nickname;

    // Dodaj novog gosta ispod DJ-a
    guestList.appendChild(newGuest);
});

// Ažuriranje liste gostiju
socket.on('updateGuestList', function (users) {
    const guestList = document.getElementById('guestList');
    guestList.innerHTML = ''; // Očisti trenutnu listu

    // Ponovo dodaj DJ-a
    const dj = document.createElement('div');
    dj.className = 'guest';
    dj.id = 'djNickname';
    dj.textContent = 'Radio Galaksija';
    guestList.appendChild(dj);

    // Dodaj ostale korisnike
    users.forEach(user => {
        const guest = document.createElement('div');
        guest.className = 'guest';
        guest.textContent = user.username; // Ili user.nickname, zavisno od tvog modela
        guestList.appendChild(guest);
    });
});

