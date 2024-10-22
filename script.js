// Kelas NFA untuk mendefinisikan automata
class NFA {
    constructor() {
        // Definisikan NFA secara langsung di constructor
        this.q = ["q0", "q1", "q2", "q3", "q4", "q5"];  // Set of states
        this.sigma = ["0", "1"];  // Set of input symbols
        this.delta = {
            "q0": { "1": ["q1"], "0": ["q2"] },
            "q1": { "1": ["q3"] },
            "q2": { "1": ["q5"] },
            "q3": { "0": ["q4"] },
            "q4": { "1": ["q1"] },
            "q5": { "0": ["q5"], "1": ["q5"] }
        };  // Transition function as a dictionary
        this.initial_state = "q0";  // Initial state
        this.f = ["q3", "q5"];  // Final states
    }

    // Fungsi untuk mendapatkan semua jalur dari state awal ke state akhir
    getPaths(state, path = "", visited = new Set()) {
        // Jika state saat ini adalah state akhir, kembalikan jalur yang ditemukan
        if (this.f.includes(state)) {
            return [path];  // State akhir tercapai, kembalikan jalur
        }

        // Tandai state saat ini sebagai dikunjungi untuk mencegah loop tak terbatas
        visited.add(state);

        // Inisialisasi array untuk menyimpan semua jalur
        let paths = [];

        // Iterasi melalui semua simbol input dari state saat ini
        for (let symbol in this.delta[state]) {
            // Untuk setiap transisi, iterasi ke semua state tujuan
            for (let nextState of this.delta[state][symbol]) {
                if (!visited.has(nextState)) {
                    // Rekursif untuk mencari jalur dari nextState, tambahkan simbol ke jalur
                    let newPaths = this.getPaths(nextState, path + symbol, new Set(visited));
                    paths = paths.concat(newPaths);  // Gabungkan semua jalur
                }
            }
        }

        return paths;
    }

    // Fungsi tambahan untuk menangani state looping (seperti q5) yang berisi loop
    handleLoopingStates() {
        let loops = [];
        for (let state of this.f) {
            if (state === "q5") {
                loops.push("(0|1)*");  // Representasikan loop di q5
            }
        }
        return loops;
    }

    // Method untuk menghasilkan regex berdasarkan transisi di NFA
    generateRegex() {
        // Dapatkan semua jalur dari state awal ke semua state akhir
        const paths = this.getPaths(this.initial_state);

        // Tangani state dengan loop (seperti q5)
        const loops = this.handleLoopingStates();

        // Gabungkan jalur ke state q5 dengan loop di state q5
        const finalPaths = paths.map(path => {
            // Jika jalur menuju q5, tambahkan loop (0|1)*
            return path.includes("01") ? `${path}${loops.join('')}` : path;
        });

        // Gabungkan jalur-jalur tersebut dengan OR (|) untuk membentuk regex
        const regex = finalPaths.length > 0 ? `(${finalPaths.join(" | ")})` : "";
        return regex;
    }
}

// Kelas untuk Aturan Produksi dari FSA (Regular Grammar)
class RegularGrammar {
    constructor() {
        // Definisikan terminal dan non-terminal sesuai dengan transisi FSA
        this.non_terminals = ["S", "A", "B", "C", "D", "E"];  // Non-terminal symbols represent states
        this.terminals = ["0", "1"];  // Terminal symbols
        this.productions = {
            "S": ["1A", "0B"],  // S -> 1A | 0B (transisi dari q0)
            "A": ["1C"],        // A -> 1C (transisi dari q1 ke q3)
            "B": ["1E"],        // B -> 1E (transisi dari q2 ke q5)
            "C": ["0D"],        // C -> 0D (transisi dari q3 ke q4)
            "D": ["1A"],        // D -> 1A (transisi dari q4 ke q1)
            "E": ["0E", "1E"]   // E -> 0E | 1E (loop di q5)
        };  // Productions (rules)
        this.start_symbol = "S";  // Start symbol yang merepresentasikan state q0
    }

    // Method untuk menampilkan aturan produksi
    getProductions() {
        let result = "Aturan Produksi dari FSA:\n";
        for (const non_terminal in this.productions) {
            result += `${non_terminal} -> ${this.productions[non_terminal].join(" | ")}\n`;
        }
        return result;
    }
}

// Instansiasi NFA dan Regular Grammar
const nfa_no_2 = new NFA();
const rg = new RegularGrammar();

// Fungsi untuk menampilkan regular expression yang dihasilkan dari NFA
function generateRegex() {
    const regex = nfa_no_2.generateRegex();
    document.getElementById('result').textContent = "Generated Regular Expression: " + regex;
}

// Fungsi untuk menampilkan aturan produksi dari FSA
function displayProductions() {
    const productions = rg.getProductions();
    document.getElementById('rg-result').textContent = productions;
}
