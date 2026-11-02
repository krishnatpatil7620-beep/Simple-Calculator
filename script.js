

const result = document.getElementById("result");
const history = document.getElementById("history");


let expression = "";


function updateDisplay() {
    result.value = expression || "0";
}


function clearCalculator() {
    expression = "";
    history.textContent = "";
    updateDisplay();
}


function deleteLast() {
    expression = expression.slice(0, -1);
    updateDisplay();
}


function appendValue(value) {
    if (expression === "Error") {
        expression = "";
    }

    
    if (value === ".") {
        const currentNumber = expression.split(/[+\-*/%]/).pop();

        if (currentNumber.includes(".")) {
            return;
        }
    }

    
    if (["+", "-", "*", "/", "%"].includes(value)) {
        if (expression === "" && value !== "-") {
            return;
        }

        if (/[+\-*/%]$/.test(expression)) {
            expression = expression.slice(0, -1);
        }
    }

    expression += value;
    updateDisplay();
}


function changeSign() {
    if (!expression) return;

    if (/^-?\d+(\.\d+)?$/.test(expression)) {
        expression = expression.startsWith("-")
            ? expression.slice(1)
            : "-" + expression;
    }

    updateDisplay();
}


function calculate() {
    if (!expression) return;

    try {
        
        if (/[+\-*/%.]$/.test(expression)) {
            throw new Error("Incomplete expression");
        }

        
        if (!/^[0-9+\-*/%.() ]+$/.test(expression)) {
            throw new Error("Invalid input");
        }

        
        const tokens = expression.match(
            /(\d*\.?\d+|[+\-*/%])/g
        );

        for (let i = 0; i < tokens.length - 1; i++) {
            if (
                (tokens[i] === "/" || tokens[i] === "%") &&
                Number(tokens[i + 1]) === 0
            ) {
                throw new Error("Cannot divide by zero");
            }
        }

        
        const answer = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (!Number.isFinite(answer)) {
            throw new Error("Invalid calculation");
        }

        history.textContent = expression + " =";

        expression = String(
            Number(answer.toPrecision(12))
        );

        updateDisplay();

    } catch (error) {
        history.textContent = error.message;
        result.value = "Error";
        expression = "";
    }
}


document.querySelector(".buttons").addEventListener(
    "click",
    function(event) {

        const button = event.target.closest("button");

        if (!button) return;

        const action = button.dataset.action;
        const value = button.dataset.value;

        if (action === "clear") {
            clearCalculator();
        }
        else if (action === "delete") {
            deleteLast();
        }
        else if (action === "calculate") {
            calculate();
        }
        else if (action === "sign") {
            changeSign();
        }
        else if (value !== undefined) {
            appendValue(value);
        }
    }
);
