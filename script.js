const board = document.getElementById("board");
const resetBtn = document.getElementById("resetBtn");
const captureBtn = document.getElementById("captureBtn");

const categories = {
  eleves: {
    color: "#009F8C",
    container: document.querySelector('section[data-category="eleves"] .cards-container'),
    cards: [
      "Effet élève 1","Effet élève 2","Effet élève 3","Effet élève 4","Effet élève 5",
      "Effet élève 6","Effet élève 7","Effet élève 8","Effet élève 9","Effet élève 10",
      "Effet élève 11","Effet élève 12","Effet élève 13","Effet élève 14"
    ]
  },
  conditionsE: {
    color: "#EF7D00",
    container: document.querySelector('section[data-category="conditionsE"] .cards-container'),
    cards: [
      "Condition enseignant 1","Condition enseignant 2","Condition enseignant 3","Condition enseignant 4","Condition enseignant 5",
      "Condition enseignant 6","Condition enseignant 7","Condition enseignant 8","Condition enseignant 9","Condition enseignant 10",
      "Condition enseignant 11"
    ]
  },
  recommandationsE: {
    color: "#EF7D00",
    container: document.querySelector('section[data-category="recommandationsE"] .cards-container'),
    cards: [
      "Recommandation enseignant 1","Recommandation enseignant 2","Recommandation enseignant 3","Recommandation enseignant 4","Recommandation enseignant 5",
      "Recommandation enseignant 6","Recommandation enseignant 7","Recommandation enseignant 8","Recommandation enseignant 9","Recommandation enseignant 10",
      "Recommandation enseignant 11", "Recommandation enseignant 12", "Recommandation enseignant 13"
    ]
  },
  ConditionsEquipe: {
    color: "#AD498D",
    container: document.querySelector('section[data-category="ConditionsEquipe"] .cards-container'),
    cards: [
      "Condition équipe 1","Condition équipe 2","Condition équipe 3"
    ]
  },
  RecommandationEquipe: {
    color: "#AD498D",
    container: document.querySelector('section[data-category="RecommandationEquipe"] .cards-container'),
    cards: [
      "Recommandation équipe 1"
    ]
  },
};

let allCards = [];
let boardCards = new Set();

function createHexCard(text, color) {
  const container = document.createElement("div");
  container.className = "hex-card";
  container.dataset.text = text;
  container.style.width = "90px";
  container.style.height = "90px";
  container.style.position = "relative";
  container.style.cursor = "grab";
  container.style.perspective = "1000px";
  container.style.zIndex = "auto";

  const inner = document.createElement("div");
  inner.className = "card-inner";

  // Face avant
  const front = document.createElement("div");
  front.className = "card-face card-front";

  const svgFront = createHexSVG(text, color);
  front.appendChild(svgFront);

  // Face arrière
  const back = document.createElement("div");
  back.className = "card-face card-back";

  const svgBack = createHexSVG("Dos", color);
  back.appendChild(svgBack);

  inner.appendChild(front);
  inner.appendChild(back);
  container.appendChild(inner);

  // Bouton pour retourner la carte
  const flipBtn = document.createElement("button");
  flipBtn.className = "button-flip";
  flipBtn.textContent = "Retourner";
  flipBtn.onclick = e => {
    e.stopPropagation();
    container.classList.toggle("flipped");
  };
  container.appendChild(flipBtn);

  // Drag events for cards in sidebar: copy to board on dragstart
  container.draggable = true;
  container.addEventListener("dragstart", e => {
    if (boardCards.has(container)) return; // already on board, allow move
    e.dataTransfer.setData("text/plain", text);
    e.dataTransfer.effectAllowed = "copy";
  });

  return container;
}

function createHexCardOnBoard(text, color, x = 20, y = 20) {
  const container = document.createElement("div");
  container.className = "hex-card";
  container.dataset.text = text;
  container.style.width = "140px";
  container.style.height = "140px";
  container.style.left = x + "px";
  container.style.top = y + "px";
  container.style.position = "absolute";
  container.style.cursor = "grab";
  container.style.perspective = "1000px";
  container.style.zIndex = 1000;

  const inner = document.createElement("div");
  inner.className = "card-inner";

  // Face avant
  const front = document.createElement("div");
  front.className = "card-face card-front";

  const svgFront = createHexSVG(text, color);
  front.appendChild(svgFront);

  // Face arrière
  const back = document.createElement("div");
  back.className = "card-face card-back";

  const svgBack = createHexSVG("Dos", color);
  back.appendChild(svgBack);

  inner.appendChild(front);
  inner.appendChild(back);
  container.appendChild(inner);

  // Bouton pour retourner la carte
  const flipBtn = document.createElement("button");
  flipBtn.className = "button-flip";
  flipBtn.textContent = "Retourner";
  flipBtn.onclick = e => {
    e.stopPropagation();
    container.classList.toggle("flipped");
  };
  container.appendChild(flipBtn);

  // Drag & drop move on board
  let offsetX, offsetY, isDragging = false;

  container.addEventListener("mousedown", e => {
    isDragging = true;
    offsetX = e.clientX - container.offsetLeft;
    offsetY = e.clientY - container.offsetTop;
    container.style.zIndex = 10000;
  });

  document.addEventListener("mousemove", e => {
    if (isDragging) {
      container.style.left = (e.clientX - offsetX) + "px";
      container.style.top = (e.clientY - offsetY) + "px";
    }
  });

  document.addEventListener("mouseup", e => {
    if (isDragging) {
      isDragging = false;
      container.style.zIndex = 1000;
    }
  });

  return container;
}

function createHexSVG(label, color) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.classList.add("hex-shape");

  const polygon = document.createElementNS(svgNS, "polygon");
  polygon.setAttribute("points", "50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25");
  polygon.setAttribute("fill", color);
  svg.appendChild(polygon);

  const text = document.createElementNS(svgNS, "text");
  text.setAttribute("x", "50");
  text.setAttribute("y", "55");
  text.setAttribute("class", "hex-label");
  text.textContent = label;
  svg.appendChild(text);

  return svg;
}

function hideCardInSidebar(text) {
  const cardObj = allCards.find(c => c.text === text);
  if (cardObj) {
    cardObj.element.style.opacity = "0.3";
    cardObj.element.style.pointerEvents = "none";
  }
}

function showAllSidebarCards() {
  allCards.forEach(c => {
    c.element.style.opacity = "1";
    c.element.style.pointerEvents = "auto";
  });
}

// Initialisation : création des cartes dans chaque catégorie
function initSidebar() {
  for (const catKey in categories) {
    categories[catKey].cards.forEach(text => {
      const card = createHexCard(text, categories[catKey].color);
      categories[catKey].container.appendChild(card);
      allCards.push({text: text, category: catKey, element: card});
    });
  }
}

board.addEventListener("dragover", e => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
});

board.addEventListener("drop", e => {
  e.preventDefault();
  const text = e.dataTransfer.getData("text/plain");
  const cardInfo = allCards.find(c => c.text === text);
  if (cardInfo) {
    const rect = board.getBoundingClientRect();
    const x = e.clientX - rect.left - 70;
    const y = e.clientY - rect.top - 70;
    const newCard = createHexCardOnBoard(text, categories[cardInfo.category].color, x, y);
    board.appendChild(newCard);
    boardCards.add(newCard);
    hideCardInSidebar(text);
  }
});

resetBtn.addEventListener("click", () => {
  boardCards.forEach(card => {
    card.remove();
  });
  boardCards.clear();
  showAllSidebarCards();
});

captureBtn.addEventListener("click", () => {
  html2canvas(board).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const newTab = window.open();
    newTab.document.body.style.margin = "0";
    newTab.document.body.style.textAlign = "center";
    const img = newTab.document.createElement("img");
    img.src = imgData;
    img.style.maxWidth = "100%";
    img.style.height = "auto";
    newTab.document.body.appendChild(img);
  });
});

initSidebar();
