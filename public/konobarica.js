// Kada se povežemo sa serverom, emitujemo događaj za novog gosta
socket.emit('new_guest');

// Slušamo za poruke od servera, u ovom slučaju pozdravnu poruku od Konobarice
socket.on('message', (data) => {
    const messageArea = document.getElementById('messageArea');
    
    // Kreiramo HTML element za poruku
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    // Dodajemo korisničko ime i poruku
    messageElement.innerHTML = `
        <strong>${data.username}:</strong> ${data.message}
    `;
    
    // Ako je sistemska poruka, dodajemo odgovarajući stil
    if (data.isSystemMessage) {
        messageElement.classList.add('system-message');
    }
    
    // Dodajemo poruku na vrh umesto na dno
    messageArea.insertBefore(messageElement, messageArea.firstChild);
});

// Dodavanje Konobarice u listu gostiju (ako je potrebno)
const konobaricaItem = document.createElement('div');
konobaricaItem.classList.add('guest-konobarica');
konobaricaItem.innerHTML = 'Konobarica'; // Dodajemo samo tekst bez tagova
guestList.appendChild(konobaricaItem);

// GOSTI MODAL 
var modal = document.getElementById("gostimodal");
var btn = document.getElementById("GBtn");
var span = document.getElementsByClassName("close")[0];

// Otvori modal kada klikneš na dugme GBtn
btn.onclick = function() {
    modal.style.display = "block";
}

// Zatvori modal kada klikneš na X
span.onclick = function() {
    modal.style.display = "none";
}
  let isDragging = false;
    let offsetX, offsetY;

    modal.addEventListener('mousedown', function (e) {
        isDragging = true;
        offsetX = e.clientX - modal.offsetLeft;
        offsetY = e.clientY - modal.offsetTop;
    });

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            modal.style.left = e.clientX - offsetX + 'px';
            modal.style.top = e.clientY - offsetY + 'px';
        }
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
    });

// Funkcija za uvećanje fonta
function increaseFontSize() {
    var messageArea = document.getElementById("messageArea");
    var currentSize = window.getComputedStyle(messageArea, null).getPropertyValue('font-size');
    var newSize = parseInt(currentSize) + 2; // Povećaj veličinu fonta za 2px
    messageArea.style.fontSize = newSize + "px";
}

// Funkcija za smanjenje fonta
function decreaseFontSize() {
    var messageArea = document.getElementById("messageArea");
    var currentSize = window.getComputedStyle(messageArea, null).getPropertyValue('font-size');
    var newSize = parseInt(currentSize) - 2; // Smanji veličinu fonta za 2px
    messageArea.style.fontSize = newSize + "px";
}
//   ZA ANI TEXT
const button = document.getElementById("slova");
let slovaContainer = null;

button.addEventListener("click", () => {
  if (!slovaContainer) {
    // Kreiranje kontejnera za `slova.html`
    slovaContainer = document.createElement("div");
    slovaContainer.id = "slovaContainer";
    slovaContainer.style.position = "fixed";
    slovaContainer.style.top = "10%"; // Ne prekriva dugme
    slovaContainer.style.left = "50%";
    slovaContainer.style.transform = "translateX(-50%)";
    slovaContainer.style.width = "80%";
    slovaContainer.style.height = "70vh";
    slovaContainer.style.background = "white";
    slovaContainer.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.5)";
    slovaContainer.style.overflow = "auto";
    slovaContainer.style.padding = "10px";
    slovaContainer.style.zIndex = "1000";

    // Dugme za zatvaranje
    let closeButton = document.createElement("button");
    closeButton.innerText = "Zatvori";
    closeButton.style.position = "absolute";
    closeButton.style.top = "5px";
    closeButton.style.right = "10px";
    closeButton.addEventListener("click", () => {
      slovaContainer.remove();
      slovaContainer = null;
    });

    slovaContainer.appendChild(closeButton);

    // Učitavanje `slova.html`
    fetch("slova.html")
      .then(response => response.text())
      .then(data => {
        slovaContainer.innerHTML += data; // Dodajte sadržaj slova.html u container
        
        document.body.appendChild(slovaContainer); // Prikazivanje u aplikaciji
      });

  } else {
    // Uklanjanje `slova.html` sadržaja
    slovaContainer.remove();
    slovaContainer = null;
  }
});
