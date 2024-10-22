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
// Final states are q0, q2, q4
const acceptingStates = new Set(["q0", "q2", "q4"]);

// Function to simulate the NFA with branching paths
function simulateNFA() {
    const inputString = document.getElementById('inputString').value;
    let results = [];

    function simulatePath(currentStates, inputIndex, path) {
        if (inputIndex === inputString.length) {
            // End of the input string, check if any of the current states are accepting
            const isAccepted = Array.from(currentStates).some(state => acceptingStates.has(state));
            const finalStates = Array.from(currentStates).join(", ");
            const result = `Final States: {${finalStates}} - ${isAccepted ? "Accepted" : "Rejected"}<br>`;
            results.push(`Path: ${path} - ${result}`);
            return;
        }

        const symbol = inputString[inputIndex];
        if (!sigma.has(symbol)) {
            results.push(`Invalid symbol: ${symbol}<br>`);
            return;
        }

        let nextStates = new Set();
        currentStates.forEach(state => {
            if (delta[state] && delta[state][symbol]) {
                delta[state][symbol].forEach(s => nextStates.add(s));
            }
        });

        if (nextStates.size === 0) {
            results.push(`No valid transitions on input '${symbol}' from states {${Array.from(currentStates).join(", ")}}.<br>`);
            return;
        }

        // For each possible next state, recursively simulate the next step
        nextStates.forEach(nextState => {
            simulatePath(new Set([nextState]), inputIndex + 1, `${path} -> ${nextState}`);
        });
    }

    // Start simulation from the initial state
    simulatePath(new Set([initialState]), 0, `q0`);

    // Display the results
    document.getElementById('result').innerHTML = results.join("<br>");
}
