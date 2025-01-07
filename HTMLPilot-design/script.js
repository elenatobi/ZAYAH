let canvas = null;
let ctx = null;
function main() {
    canvas = document.getElementById("mainView");
    ctx = canvas.getContext("2d");
    resize();
}

function resize() {
    if (canvas) {
        let { width, height } = canvas.parentElement.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
    }

    render();
}

function render() {
    if (!canvas) {
        return;
    }

    ctx.fillStyle = "purple";
    ctx.fillRect(canvas.width / 2 - 5, canvas.height / 2 - 5, 10, 10);
}

document.addEventListener("DOMContentLoaded", main);
window.addEventListener("resize", resize);
