document.addEventListener("DOMContentLoaded", () => {
    const output = document.getElementById("output");
    const keys = document.querySelectorAll(".key");
    const capsLockKey = document.getElementById("caps-lock");
    const shiftKey = document.getElementById("shift");
    const backspaceKey = document.getElementById("backspace");

    let isUpperCase = true; // Default to uppercase for Shift
    let isCapsLock = false; // Default Caps Lock state

    // Function to toggle Caps Lock
    function toggleCapsLock() {
        isCapsLock = !isCapsLock;
        keys.forEach((key) => {
            if (!key.id && !key.classList.contains("space")) {
                key.textContent = isCapsLock
                    ? key.textContent.toUpperCase()
                    : key.textContent.toLowerCase();
            }
        });
        capsLockKey.classList.toggle("active", isCapsLock); // Visual feedback for Caps Lock
    }

    // Function to toggle Shift
    function toggleShiftCase() {
        keys.forEach((key) => {
            if (!key.id && !key.classList.contains("space")) {
                key.textContent = isUpperCase
                    ? key.textContent.toLowerCase()
                    : key.textContent.toUpperCase();
            }
        });
        isUpperCase = !isUpperCase;
    }

    // Add event listeners for keys
    keys.forEach((key) => {
        key.addEventListener("click", () => {
            const keyValue = key.textContent.trim();

            // Check if the key is special
            if (key.id === "caps-lock") {
                toggleCapsLock();
                return;
            }
            if (key.id === "shift") {
                toggleShiftCase();
                return;
            }
            if (key.id === "backspace") {
                output.value = output.value.slice(0, -1); // Remove last character
                return;
            }
            if (key.id === "space") {
                output.value += " "; // Add space
                return;
            }

            // Handle regular key
            output.value += keyValue;
        });

        // Touch support for special keys
        key.addEventListener("touchstart", (event) => {
            event.preventDefault(); // Prevent click event from firing
            key.click();
        });
    });
});
