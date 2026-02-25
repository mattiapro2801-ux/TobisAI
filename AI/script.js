// ===============================
// ELEMENTI BASE
// ===============================
const input = document.querySelector(".ai-input");
const sendBtn = document.querySelector(".ai-send");
const chat = document.querySelector(".ai-chat");
const previewArea = document.querySelector(".image-preview-area");

const uploadBtn = document.getElementById("uploadBtn");
const imgInput = document.getElementById("imgInput");

const cameraBtn = document.getElementById("cameraBtn");
const cameraInput = document.getElementById("cameraInput");

let loadedImages = [];


// ===============================
// PULSANTI MATEMATICI
// ===============================
document.querySelectorAll(".math-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    input.value += btn.dataset.insert;
    input.focus();
  });
});


// ===============================
// NORMALIZZAZIONE ESPRESSIONI
// ===============================
function normalizeExpression(text) {
  return text
    .replace(/×/g, "*")
    .replace(/x/gi, "*")
    .replace(/per/gi, "*")
    .replace(/÷/g, "/")
    .replace(/diviso/gi, "/")
    .replace(/:/g, "/");
}


// ===============================
// RADICI
// ===============================
function solveSquareRoot(text) {
  if (text.includes("√")) {
    const num = text.replace("√", "").trim();
    const n = parseFloat(num);
    if (!isNaN(n)) {
      return {
        html: `
          <div>Radice quadrata:</div>
          <div>√${n} = ${Math.sqrt(n)}</div>
        `
      };
    }
  }
  return null;
}


// ===============================
// ESPRESSIONI
// ===============================
function solveExpression(expr) {
  try {
    const normalized = normalizeExpression(expr);

    if (!/^[0-9+\-*/().\s^√]+$/.test(normalized)) return null;

    const safe = normalized.replace(/\^/g, "**");
    const result = Function(`"use strict"; return (${safe})`)();

    return {
      html: `
        <div>Espressione: ${expr}</div>
        <div>Interpretazione: ${normalized}</div>
        <div>Risultato: ${result}</div>
      `
    };
  } catch {
    return null;
  }
}


// ===============================
// GEOMETRIA
// ===============================
function solveGeometry(text) {
  const lower = text.toLowerCase();

  if (lower.includes("quadrato") && lower.includes("lato")) {
    const nums = text.match(/\d+/g);
    if (!nums) return null;

    const lato = parseFloat(nums[0]);
    return {
      html: `
        <div>Quadrato:</div>
        <div>Lato = ${lato}</div>
        <div>Area = ${lato * lato}</div>
        <div>Perimetro = ${lato * 4}</div>
      `
    };
  }

  if (lower.includes("rettangolo")) {
    const nums = text.match(/\d+/g);
    if (!nums || nums.length < 2) return null;

    const base = parseFloat(nums[0]);
    const h = parseFloat(nums[1]);

    return {
      html: `
        <div>Rettangolo:</div>
        <div>Base = ${base}</div>
        <div>Altezza = ${h}</div>
        <div>Area = ${base * h}</div>
        <div>Perimetro = ${2 * (base + h)}</div>
      `
    };
  }

  return null;
}


// ===============================
// GENERA RISPOSTA
// ===============================
function generateAIResponse(text) {

  const geo = solveGeometry(text);
  if (geo) return geo;

  const sqrt = solveSquareRoot(text);
  if (sqrt) return sqrt;

  const expr = solveExpression(text);
  if (expr) return expr;

  return {
    text: "Non ho capito. Dammi un’espressione, una radice o un problema di geometria."
  };
}


// ===============================
// INVIO MESSAGGIO
// ===============================
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  const typing = showTyping();

  setTimeout(() => {
    typing.remove();

    const response = generateAIResponse(text);

    if (response.html) addMessage(response.html, "bot", true);
    else addMessage(response.text, "bot");

  }, 400);
}


// ENTER
input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

// CLICK
sendBtn.addEventListener("click", sendMessage);
