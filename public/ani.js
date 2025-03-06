document.getElementById('slova').addEventListener('click', function() {
  // Proveri da li je div već prikazan
  const commandTable = document.querySelector('.command-table');
  
  if (commandTable) {
    // Ako je već prikazan, ukloni ga
    commandTable.remove();
  } else {

const commandTableHTML = `
<div class="command-table">
    <label>Tekst: <input type="text" id="textInput" value="Animirani tekst"></label>
    <label>Boja teksta: <input type="color" id="textColor" value="#ffffff"></label>
    <label>Font: 
      <select id="fontSelect">
        <option value="Arial">Arial</option>
        <option value="Verdana">Verdana</option>
        <option value="Courier New">Courier New</option>
        <option value="Georgia">Georgia</option>
        <option value="Times New Roman">Times New Roman</option>
      </select>
    </label>
    <label>Animacija: 
      <select id="animationSelect">
        <option value="bounce">Bounce</option>
        <option value="fadeIn">Fade In</option>
        <option value="zoom">Zoom</option>
        <option value="shake">Shake</option>
        <option value="slideUp">Slide Up</option>
        <option value="rotateX">RotateX</option>
        <option value="rotateY">RotateY</option>
        <option value="rotateZ">RotateZ</option>
        <option value="rotate3D">Rotate3D</option>
        <option value="marquee">Marquee</option>
      </select>
    </label>
    <label>Brzina animacije:
      <input type="range" id="speedRange" min="1" max="100" value="50">
    </label>
    <label>Veličina fonta:
      <input type="range" id="fontSize" min="10" max="100" value="50">
    </label>
    <button id="generateBtn">Generiši tekst</button>
    <button id="clearBtn">Obriši selektovani tekst</button>
    <button id="showListBtn">Kreiraj listu</button>
    <div id="textCounter">Trenutni broj tekstova: 0</div>
  </div>

  <div id="textContainer"></div>
  <div id="popupOverlay" class="popup-overlay"></div>
  <div id="popup" class="popup">
    <h2>Lista Tekstova</h2>
    <ul id="textList" class="text-list"></ul>
    <button id="closePopupBtn">Zatvori</button>
  </div>
  `;

document.body.innerHTML = commandTableHTML;

     document.addEventListener("DOMContentLoaded", function () {
      const textInput = document.getElementById("textInput");
      const textColorInput = document.getElementById("textColor");
      const fontSelect = document.getElementById("fontSelect");
      const animationSelect = document.getElementById("animationSelect");
      const speedRange = document.getElementById("speedRange");
      const fontSizeRange = document.getElementById("fontSize");
      const generateBtn = document.getElementById("generateBtn");
      const clearBtn = document.getElementById("clearBtn");
      const textContainer = document.getElementById("textContainer");
      const textCounter = document.getElementById("textCounter");
      const textList = document.getElementById("textList");
      const showListBtn = document.getElementById("showListBtn");
      const popup = document.getElementById("popup");
      const popupOverlay = document.getElementById("popupOverlay");
      const closePopupBtn = document.getElementById("closePopupBtn");

      let textElements = []; // Svi tekstovi će biti pohranjeni u ovom nizu
      let selectedTextElement = null; // Trenutno selektovan tekst

      // Funkcija za ažuriranje liste teksta
      function updateTextList() {
        textList.innerHTML = ''; // Očisti listu
        textElements.forEach((element, index) => {
          const listItem = document.createElement('li');
          listItem.innerText = `Text ${index + 1}`;
          listItem.dataset.index = index;

          // Dodaj event listener za selektovanje teksta
          listItem.addEventListener('click', function () {
            if (selectedTextElement) {
              selectedTextElement.classList.remove("selected");
            }
            selectedTextElement = element;
            element.classList.add("selected");
          });

          textList.appendChild(listItem);
        });
      }

      // Generiši novi tekst
      generateBtn.addEventListener("click", function () {
        const text = textInput.value;
        const color = textColorInput.value;
        const font = fontSelect.value;
        const animation = animationSelect.value;
        const speed = 100 - speedRange.value; // Brzina u opsegu od 1 do 100 (niži broj = brža animacija)
        const fontSize = fontSizeRange.value + "px"; // Veličina fonta

        // Kreiraj novi tekst
        const textElement = document.createElement("div");
        textElement.classList.add("text-display");
        textElement.innerText = text;
        textElement.style.color = color;
        textElement.style.fontFamily = font;
        textElement.style.fontSize = fontSize;
        textElement.style.animation = `${animation} ${speed}s ease infinite`; // Animacija u loop-u

        // Dodavanje drag funkcionalnosti
        let isDragging = false;
        let offsetX, offsetY;

        textElement.addEventListener("mousedown", function (e) {
          if (selectedTextElement === textElement) {
            // Ako je tekst već selektovan, ukloni granice
            textElement.classList.remove("selected");
            selectedTextElement = null; // Ukloni selektovani tekst
          } else {
            // Ako nije selektovan, selektuj ga i dodaj granice
            if (selectedTextElement) {
              selectedTextElement.classList.remove("selected"); // Ukloni granice sa prethodno selektovanog
            }
            textElement.classList.add("selected");
            selectedTextElement = textElement; // Postavi trenutni selektovani tekst
          }

          isDragging = true;
          offsetX = e.clientX - textElement.getBoundingClientRect().left;
          offsetY = e.clientY - textElement.getBoundingClientRect().top;
          textElement.style.cursor = "grabbing";
        });

        document.addEventListener("mousemove", function (e) {
          if (!isDragging) return;
          let x = e.clientX - offsetX;
          let y = e.clientY - offsetY;
          textElement.style.left = `${x}px`;
          textElement.style.top = `${y}px`;
        });

        document.addEventListener("mouseup", function () {
          isDragging = false;
          textElement.style.cursor = "grab";
        });

        // Dodaj element na ekran
        textContainer.appendChild(textElement);
        textElements.push(textElement);
        updateTextList(); // Ažuriraj listu
        textCounter.innerText = `Trenutni broj tekstova: ${textElements.length}`;
      });

      // Brisanje selektovanog teksta
      clearBtn.addEventListener("click", function () {
        if (selectedTextElement) {
          selectedTextElement.remove();
          textElements = textElements.filter(element => element !== selectedTextElement); // Ukloni iz niza
          selectedTextElement = null;
          updateTextList(); // Ažuriraj listu
          textCounter.innerText = `Trenutni broj tekstova: ${textElements.length}`;
        }
      });

      // Prikazivanje popup-a sa listom
      showListBtn.addEventListener("click", function () {
        popup.style.display = "block";
        popupOverlay.style.display = "block";
      });

      // Zatvaranje popup-a
      closePopupBtn.addEventListener("click", function () {
        popup.style.display = "none";
        popupOverlay.style.display = "none";
      });

      // Zatvori popup ako klikneš van njega
      popupOverlay.addEventListener("click", function () {
        popup.style.display = "none";
        popupOverlay.style.display = "none";
      });
   
