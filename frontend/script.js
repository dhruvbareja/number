const API_URL = "http://127.0.0.1:8080/convert";

function isValidNumberForBase(numStr, base) {
    const baseRegexMap = {
        2: /^[01]+$/,
        8: /^[0-7]+$/,
        10: /^\d+$/,
        16: /^[0-9a-fA-F]+$/
    };
    return baseRegexMap[base]?.test(numStr);
}

let history = [];

async function convert() {
    const number1 = document.getElementById("numberInput").value.trim();
    const number2 = document.getElementById("numberInput2").value.trim();
    const fromBase = parseInt(document.getElementById("fromBase").value);
    const toBase = parseInt(document.getElementById("toBase").value);
    const operation = document.getElementById("operation").value;

    if (!number1 || !number2) {
        alert("⚠ Please enter both numbers.");
        return;
    }

    if (!isValidNumberForBase(number1, fromBase) || !isValidNumberForBase(number2, fromBase)) {
        alert(`❌ Invalid number(s) for base ${fromBase}.`);
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ number1, number2, fromBase, toBase, operation })
        });

        const data = await response.json();

        if (data.error) {
            alert("❌ Error: " + data.error);
        } else {
            document.getElementById("result").innerText = `✅ Converted Result: ${data.result}`;
            updateHistory(`${number1} ${operation} ${number2} ➜ ${data.result}`);
        }
    } catch (error) {
        console.error("⚠ Fetch Error:", error);
        alert("❌ Failed to connect to backend.");
    }
}

// Live preview base conversion
document.getElementById("numberInput").addEventListener("input", () => {
    const input = document.getElementById("numberInput").value.trim();
    const fromBase = parseInt(document.getElementById("fromBase").value);

    try {
        const dec = parseInt(input, fromBase);
        document.getElementById("previewBin").innerText = dec.toString(2);
        document.getElementById("previewOct").innerText = dec.toString(8);
        document.getElementById("previewDec").innerText = dec.toString(10);
        document.getElementById("previewHex").innerText = dec.toString(16).toUpperCase();
    } catch {
        document.getElementById("previewBin").innerText =
        document.getElementById("previewOct").innerText =
        document.getElementById("previewDec").innerText =
        document.getElementById("previewHex").innerText = "-";
    }
});

// Dark mode toggle
document.getElementById("darkModeToggle").addEventListener("change", function () {
    document.body.classList.toggle("dark-mode", this.checked);
});

// Show last 5 conversions
function updateHistory(entry) {
    history.unshift(entry);
    if (history.length > 5) history.pop();

    const ul = document.getElementById("historyList");
    ul.innerHTML = "";
    history.forEach(item => {
        const li = document.createElement("li");
        li.innerText = item;
        ul.appendChild(li);
    });
}