class AuraConsole {
    constructor() {
        this.button = document.createElement("button");
        this.button.innerHTML = "Open console";
        this.button.className = "AuraConsoleOpen";
        document.body.appendChild(this.button);

        this.consoleView = document.createElement("div");
        this.consoleView.className = "AuraConsole";
        document.body.appendChild(this.consoleView);

        this.closeButton = document.createElement("button");
        this.closeButton.innerHTML = "Close";
        this.closeButton.className = "AuraConsoleClose";
        this.consoleView.appendChild(this.closeButton);

        this.start();
    }

    open() {
        this.consoleView.style.display = "block";
    }

    close() {
        this.consoleView.style.display = "none";
    }

    start() {
        let auraConsole = this;
        this.button.addEventListener("click", function () {
            auraConsole.open();
        });

        this.closeButton.addEventListener("click", function () {
            auraConsole.close();
        });
    }

    createMessage(message) {
        let p = document.createElement("p");
        this.consoleView.appendChild(p);
        this.consoleView.scrollTop = this.consoleView.scrollHeight;
        p.innerHTML = message;
        return p;
    }

    log(...messages) {
        let message = messages.join(" ");
        let p = this.createMessage(message);
        p.className = "AuraConsoleLog";
    }

    error(message, source = "module", lineno = NaN, colno = NaN) {
        message = `${message} (${source}: Line ${lineno}, Col ${colno})`;
        let p = this.createMessage(message);
        p.className = "AuraConsoleError";
    }
}

window.onload = function () {
    let auraConsole = new AuraConsole();
    let originalLog = console.log;
    console.log = function (...message) {
        auraConsole.log(...message);
        originalLog(...message);
    };

    let originalError = console.log;
    console.error = function (...message) {
        auraConsole.error(message);
        originalError(...message);
    };

    window.onerror = function (message, source, lineno, colno, error) {
        auraConsole.error(message, source, lineno, colno);
    };
};
