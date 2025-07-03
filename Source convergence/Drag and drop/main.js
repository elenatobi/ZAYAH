function enableSortCards({
    container,
    cardSelector,
    
} = {}

container, cardSelector, config = {}) {
    const {
        placeholderClass = "section-placeholder",
        longPressDelay = 200,
        animatePlaceholder = false,
        highlightDropZone = false,
        scrollEdgeThreshold = 50,
        scrollSpeed = 10,
    } = config;

    if (!container) throw new Error(`There is no container \`${container}\``);

    const placeholder = document.createElement("div");
    placeholder.className = placeholderClass;

    let draggingElement = null;
    let targetElement = null;
    let targetElementBounds = null;
    let isSorting = false;
    let touchTimer = null;
    let scrollInterval = null;

    function getCardFromEvent(event) {
        const point = event.touches?.[0] || event;
        const rawElement = document.elementFromPoint(
            point.clientX,
            point.clientY
        );
        return rawElement?.closest(cardSelector) || null;
    }

    function insertPlaceholder(target) {
        if (
            target &&
            target !== placeholder &&
            target.parentNode === container
        ) {
            if (animatePlaceholder) {
                placeholder.style.transition = "margin 0.2s";
            }

            const draggingRect = draggingElement?.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();

            const shouldInsertAfter =
                draggingRect && targetRect && targetRect.top > draggingRect.top;

            if (shouldInsertAfter && target.nextSibling !== placeholder) {
                container.insertBefore(placeholder, target.nextSibling);
            } else if (!shouldInsertAfter && target !== placeholder) {
                container.insertBefore(placeholder, target);
            }
        }
    }

    function startSorting(event) {
        isSorting = true;
        draggingElement = getCardFromEvent(event);
        if (draggingElement) {
            placeholder.style.height = `${draggingElement.offsetHeight}px`;
            placeholder.style.width = `${draggingElement.offsetWidth}px`;
            draggingElement.style.opacity = "0.5";
            if (highlightDropZone) {
                container.classList.add("drag-target");
            }
            handleTouchDrag(event);
        }
    }

    function handleTouchDrag(event) {
        const touches = event.touches;
        if (!touches) return;
        if (touches.length > 1) return;
        const touch = touches[0];

        const { clientX: x, clientY: y } = touch;
        const withinBounds =
            targetElementBounds &&
            x >= targetElementBounds.left &&
            x <= targetElementBounds.right &&
            y >= targetElementBounds.top &&
            y <= targetElementBounds.bottom;

        if (!withinBounds) {
            targetElement = getCardFromEvent(event);
            if (!targetElement) return;
            targetElementBounds = targetElement.getBoundingClientRect();
            insertPlaceholder(targetElement);
        }

        autoScroll(y);
    }

    function finalizeSort() {
        if (draggingElement && placeholder.parentNode === container) {
            container.insertBefore(draggingElement, placeholder);
        }
        resetState();
    }

    function resetState() {
        draggingElement && (draggingElement.style.opacity = "");
        draggingElement = null;
        targetElement = null;
        targetElementBounds = null;
        isSorting = false;
        placeholder.remove();
        stopAutoScroll();
        if (highlightDropZone) {
            container.classList.remove("drag-target");
        }
    }

    // Native mouse drag handlers
    container.addEventListener("dragstart", (event) => {
        draggingElement = event.target.closest(cardSelector);
        if (!draggingElement) return;
        placeholder.style.height = `${draggingElement.offsetHeight}px`;
        placeholder.style.width = `${draggingElement.offsetWidth}px`;
        draggingElement.classList.add("dragging");
        if (highlightDropZone) container.classList.add("drag-target");
    });

    container.addEventListener("dragover", (event) => {
        event.preventDefault();
        const target = event.target.closest(cardSelector);
        if (target && target !== placeholder) {
            insertPlaceholder(target);
        }

        autoScroll(event.clientY);
    });

    container.addEventListener("dragend", () => {
        if (draggingElement && placeholder.parentNode === container) {
            container.insertBefore(draggingElement, placeholder);
        }
        draggingElement?.classList.remove("dragging");
        resetState();
    });

    // Touch handlers
    container.addEventListener("touchstart", (event) => {
        touchTimer = setTimeout(() => startSorting(event), longPressDelay);
    });

    container.addEventListener("touchmove", (event) => {
        if (isSorting) {
            event.preventDefault();
            handleTouchDrag(event);
        } else {
            clearTimeout(touchTimer);
        }
    });

    container.addEventListener("touchend", () => {
        clearTimeout(touchTimer);
        if (isSorting) finalizeSort();
    });

    // Auto-scroll implementation
    function autoScroll(pointerY) {
        stopAutoScroll(); // stop previous loop
        const rect = container.getBoundingClientRect();
        let direction = 0;

        console.log(
            rect.top + scrollEdgeThreshold,
            pointerY,
            rect.bottom - scrollEdgeThreshold
        );
        if (pointerY < rect.top + scrollEdgeThreshold) {
            direction = -1;
        } else if (pointerY > rect.bottom - scrollEdgeThreshold) {
            direction = 1;
        }

        if (direction !== 0) {
            scrollInterval = setInterval(() => {
                container.scrollBy({ top: scrollSpeed * direction });
            }, 16); // roughly 60fps
        }
    }

    function stopAutoScroll() {
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;
        }
    }
}

enableSortCards(document.querySelector("#card-container"), ".my-card", {
    animatePlaceholder: true,
    highlightDropZone: true,
    scrollEdgeThreshold: 60,
    scrollSpeed: 15,
});
