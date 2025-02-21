class VirtualKeyboard {
    constructor(outputElement, layouts = {}, defaultLayout = "latin") {
        this.outputElement = outputElement;
        this.keyboardContainer = null;
        this.layouts = layouts;
        this.activeLayout = defaultLayout;
        this.shift = false;
        this.init();
    }

    init() {
        this.createKeyboardContainer();
        this.renderKeys();
        this.addToggleKeyboardEvent();
    }

    createKeyboardContainer() {
        this.keyboardContainer = document.createElement("div");
        this.keyboardContainer.className = "keyboard-container";
        document.body.appendChild(this.keyboardContainer);
    }

    renderKeys() {
        this.keyboardContainer.innerHTML = "";

        const layout = this.layouts[this.activeLayout];
        if (!layout) {
            console.error(`Layout "${this.activeLayout}" not found.`);
            return;
        }

        layout.forEach((row) => {
            const rowDiv = document.createElement("div");
            rowDiv.className = "keyboard-row";

            row.split(" ").forEach((key) => {
                const keyButton = document.createElement("button");
                keyButton.className = "key";
                keyButton.textContent = this.shift ? key.toUpperCase() : key;
                keyButton.addEventListener("click", () =>
                    this.handleKeyPress(key)
                );
                rowDiv.appendChild(keyButton);
            });

            this.keyboardContainer.appendChild(rowDiv);
        });
    }

    handleKeyPress(key) {
        if (key === "shift") {
            this.shift = !this.shift;
            this.renderKeys();
        } else if (key === "<=") {
            this.outputElement.value = this.outputElement.value.slice(0, -1);
        } else if (key === "space") {
            this.outputElement.value += " ";
        } else {
            this.outputElement.value += key;
        }
    }

    addToggleKeyboardEvent() {
        const toggleButton = document.createElement("button");
        toggleButton.textContent = "Toggle Keyboard";
        toggleButton.className = "toggle-keyboard";
        toggleButton.addEventListener("click", () => {
            this.keyboardContainer.style.display =
                this.keyboardContainer.style.display === "none"
                    ? "block"
                    : "none";
        });
        document.body.appendChild(toggleButton);
    }

    switchLayout(layout) {
        if (this.layouts[layout]) {
            this.activeLayout = layout;
            this.renderKeys();
        } else {
            console.error(`Layout "${layout}" not found.`);
        }
    }
}

// Example layouts
const layouts = {
    latin: ["Q W E R T Y U I O P", "A S D F G H J K L", "Z X C V B N M"],
    greek: ["ϕ ς ε ρ τ υ θ ι ο π", "α σ δ φ γ η ξ κ λ", "ζ χ ψ ω β ν μ"],
    custom: ["1 2 3 4 5", "6 7 8 9 0"],
};

// Usage example
const outputElement = document.getElementById("output");
const virtualKeyboard = new VirtualKeyboard(outputElement, layouts, "latin");

// Example to switch layout dynamically
// virtualKeyboard.switchLayout('custom');
