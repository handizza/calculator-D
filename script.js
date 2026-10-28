// Memory
let current = "0";
let previous = null;
let operator = null;
let resetNext = false;

// Elements
const display = document.getElementById("display");
const keypad = document.getElementById("keypad");
const clearBtn = document.getElementById("clearBtn");

// Show the number on screen
function updateDisplay() {
  display.textContent = current;

  const length = current.length;
  display.style.fontSize = length > 9 ? "48px" : length > 6 ? "64px" : "88px";

  clearBtn.textContent = current !== "0" || operator ? "C" : "AC";
}

// Highlight the chosen operator
function highlightOperator() {
  document.querySelectorAll('[data-action="operator"]').forEach(function (btn) {
    btn.classList.toggle("active", btn.dataset.value === operator && resetNext);
  });
}

// Clean up long decimals and catch errors
function format(number) {
  if (!isFinite(number)) return "Error";
  return String(Number(number.toPrecision(9)));
}

// Typing a digit
function inputDigit(digit) {
  if (current === "Error") current = "0";
  if (resetNext || current === "0") {
    current = digit;
    resetNext = false;
  } else if (current.replace(/[-.]/g, "").length < 9) {
    current += digit;
  }
}

// Typing the decimal point
function inputDot() {
  if (resetNext || current === "Error") {
    current = "0.";
    resetNext = false;
  } else if (!current.includes(".")) {
    current += ".";
  }
}

// The maths
function calculate(a, b, op) {
  switch (op) {
    case "+": return a + b;
    case "−": return a - b;
    case "×": return a * b;
    case "÷": return b === 0 ? NaN : a / b;
  }
}

// Pressing an operator
function chooseOperator(op) {
  if (current === "Error") return;
  if (operator && !resetNext) {
    current = format(calculate(previous, Number(current), operator));
  }
  previous = Number(current);
  operator = op;
  resetNext = true;
}

// Pressing equals
function equals() {
  if (operator === null || previous === null) return;
  current = format(calculate(previous, Number(current), operator));
  previous = null;
  operator = null;
  resetNext = true;
}

// Pressing AC / C
function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  resetNext = false;
}

// One click listener for the whole keypad
keypad.addEventListener("click", function (event) {
  const btn = event.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const value = btn.dataset.value;

  if (action === "digit") inputDigit(value);
  else if (action === "dot") inputDot();
  else if (action === "operator") chooseOperator(value);
  else if (action === "equals") equals();
  else if (action === "clear") clearAll();
  else if (action === "sign" && current !== "Error") current = format(-Number(current));
  else if (action === "percent" && current !== "Error") current = format(Number(current) / 100);

  updateDisplay();
  highlightOperator();
});

updateDisplay();