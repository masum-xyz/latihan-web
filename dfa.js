// Define the NFA
const q = new Set(["q0", "q1", "q2", "q3", "q4"]);
const sigma = new Set(["0", "1"]);
const delta = {
    "q0": { "1": ["q2", "q3"] },
    "q1": { "1": ["q2", "q3"] },
    "q2": { "0": ["q0", "q1", "q4"] },
    "q3": { "0": ["q0", "q1", "q4"] },
    "q4": { "1": ["q2", "q3"] }
};
const initialState = "q0";
const acceptingStates = new Set(["q0","q2","q4"]);

// Function to simulate the NFA
function simulateNFA() {
    const inputString = document.getElementById('inputString').value;
    let currentStates = new Set([initialState]);
    let result = `Initial State: {${Array.from(currentStates).join(", ")}}<br>`;

    for (const symbol of inputString) {
        if (!sigma.has(symbol)) {
            result += `Invalid symbol: ${symbol}<br>`;
            document.getElementById('result').innerHTML = result;
            return;
        }

        let nextStates = new Set();
        currentStates.forEach(state => {
            // Check if there is a valid transition for this symbol
            if (delta[state] && delta[state][symbol]) {
                delta[state][symbol].forEach(s => nextStates.add(s));
            }
        });

        if (nextStates.size === 0) {
            result += `No valid transitions on input '${symbol}'.<br>`;
            document.getElementById('result').innerHTML = result;
            return;
        }

        result += `On input '${symbol}', move to states: {${Array.from(nextStates).join(", ")}}<br>`;
        currentStates = nextStates;
    }

    // Check if any current state is accepting
    const isAccepted = Array.from(currentStates).some(state => acceptingStates.has(state));
    result += `<br>Final States: {${Array.from(currentStates).join(", ")}}<br>`;
    result += isAccepted ? "Input is accepted!" : "Input is rejected!";
    document.getElementById('result').innerHTML = result;
}
