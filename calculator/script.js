"use strict";

// ===== DOM ELEMENTS =====
const DOM = {
  expression: document.getElementById("expression"),
  result: document.getElementById("result"),
  keys: document.getElementById("keys"),
};

// ===== CALCULATOR STATE =====
const calc = {
  firstOperand: null,
  secondOperand: null,
  operator: null,
  currentInput: "0",
  isEvaluated: false,
  hasError: false,
};

// ===== UTILITY FUNCTIONS =====
const Utils = {
  isError: () => calc.hasError || calc.currentInput === "Error",

  formatNumber: (n) => {
    if (!Number.isFinite(n)) return "Error";
    const rounded = Math.round((n + Number.EPSILON) * 1e12) / 1e12;
    return String(rounded);
  },

  getCurrentNumber: () => {
    if (calc.currentInput === "." || calc.currentInput === "-.") return 0;
    return Number(calc.currentInput);
  },

  compute: (a, op, b) => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b === 0 ? NaN : a / b;
      default: return NaN;
    }
  },
};

// ===== DISPLAY & UI =====
const Display = {
  update: () => {
    const parts = [];
    if (calc.firstOperand !== null) parts.push(Utils.formatNumber(calc.firstOperand));
    if (calc.operator) parts.push(calc.operator);
    if (calc.secondOperand !== null && !calc.isEvaluated) parts.push(Utils.formatNumber(calc.secondOperand));

    DOM.expression.textContent = parts.join(" ");
    DOM.result.textContent = calc.currentInput;
  },

  reset: () => {
    calc.firstOperand = null;
    calc.secondOperand = null;
    calc.operator = null;
    calc.currentInput = "0";
    calc.isEvaluated = false;
    calc.hasError = false;
    Display.update();
  },

  clearIfNeeded: () => {
    if (Utils.isError() || calc.isEvaluated) {
      calc.firstOperand = null;
      calc.secondOperand = null;
      calc.operator = null;
      calc.currentInput = "0";
      calc.isEvaluated = false;
      calc.hasError = false;
    }
  },
};

// ===== CALCULATOR OPERATIONS =====
const Operations = {
  appendDigit: (digit) => {
    Display.clearIfNeeded();
    if (calc.currentInput === "0") {
      calc.currentInput = digit;
    } else if (calc.currentInput === "-0") {
      calc.currentInput = "-" + digit;
    } else {
      calc.currentInput += digit;
    }
    Display.update();
  },

  appendDot: () => {
    Display.clearIfNeeded();
    if (!calc.currentInput.includes(".")) {
      calc.currentInput += ".";
    }
    Display.update();
  },

  toggleSign: () => {
    if (Utils.isError() || calc.currentInput === "0" || calc.currentInput === "0.") return;
    calc.currentInput = calc.currentInput.startsWith("-") 
      ? calc.currentInput.slice(1) 
      : "-" + calc.currentInput;
    Display.update();
  },

  backspace: () => {
    if (Utils.isError() || calc.isEvaluated) return;
    if (calc.currentInput.length <= 1 || (calc.currentInput.length === 2 && calc.currentInput.startsWith("-"))) {
      calc.currentInput = "0";
    } else {
      calc.currentInput = calc.currentInput.slice(0, -1);
      if (calc.currentInput === "-") calc.currentInput = "0";
    }
    Display.update();
  },

  chooseOperator: (op) => {
    if (Utils.isError()) return;

    const currentNum = Utils.getCurrentNumber();

    if (calc.isEvaluated) {
      calc.isEvaluated = false;
      calc.secondOperand = null;
    }

    if (calc.firstOperand === null) {
      calc.firstOperand = currentNum;
      calc.operator = op;
      calc.currentInput = "0";
      Display.update();
      return;
    }

    if (calc.operator && calc.currentInput !== "0") {
      calc.secondOperand = currentNum;
      const result = Utils.compute(calc.firstOperand, calc.operator, calc.secondOperand);

      if (!Number.isFinite(result)) {
        calc.currentInput = "Error";
        calc.hasError = true;
        calc.firstOperand = null;
        calc.secondOperand = null;
        calc.operator = null;
        Display.update();
        return;
      }

      calc.firstOperand = result;
      calc.secondOperand = null;
      calc.operator = op;
      calc.currentInput = "0";
      Display.update();
      return;
    }

    calc.operator = op;
    Display.update();
  },

  evaluate: () => {
    if (Utils.isError() || calc.operator === null || calc.firstOperand === null) return;

    const currentNum = Utils.getCurrentNumber();
    const b = calc.isEvaluated ? (calc.secondOperand ?? currentNum) : currentNum;
    const result = Utils.compute(calc.firstOperand, calc.operator, b);

    if (!Number.isFinite(result)) {
      calc.currentInput = "Error";
      calc.hasError = true;
      calc.firstOperand = null;
      calc.secondOperand = null;
      calc.operator = null;
      Display.update();
      return;
    }

    calc.secondOperand = b;
    calc.firstOperand = result;
    calc.currentInput = Utils.formatNumber(result);
    calc.isEvaluated = true;
    Display.update();
  },
};

// ===== EVENT HANDLERS =====
DOM.keys.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.dataset.digit) Operations.appendDigit(btn.dataset.digit);
  else if (btn.dataset.op) Operations.chooseOperator(btn.dataset.op);
  else if (btn.dataset.action === "dot") Operations.appendDot();
  else if (btn.dataset.action === "clear") Display.reset();
  else if (btn.dataset.action === "backspace") Operations.backspace();
  else if (btn.dataset.action === "sign") Operations.toggleSign();
  else if (btn.dataset.action === "equals") Operations.evaluate();
});

document.addEventListener("keydown", (e) => {
  const k = e.key;

  if (k >= "0" && k <= "9") return Operations.appendDigit(k);
  if (k === ".") return Operations.appendDot();
  if (k === "Enter" || k === "=") { e.preventDefault(); return Operations.evaluate(); }
  if (k === "Backspace" || k === "Delete") return Operations.backspace();
  if (k === "Escape") return Display.reset();
  if (k === "+" || k === "-" || k === "*" || k === "/") return Operations.chooseOperator(k);
});

// ===== INITIALIZE =====
Display.reset();
