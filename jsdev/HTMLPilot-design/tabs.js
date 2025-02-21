const staticTabsSelector = "[static-tabs-container]";
const tabButtonSelector = "[data-tab]";
const tabContentSelector = "[tab-content]";
const currentClassName = "active";

function initTabs() {
    const tabContainers = document.querySelectorAll(staticTabsSelector);
    for (let container of tabContainers) {
        const tabButtons = container.querySelectorAll(tabButtonSelector);
        const tabContents = container.querySelectorAll(tabContentSelector);

        function handleTabClick(button) {
            for (let i = 0; i < tabButtons.length; i++) {
                tabButtons[i].classList.remove(currentClassName);
            }
            button.classList.add(currentClassName);

            for (let i = 0; i < tabContents.length; i++) {
                tabContents[i].classList.remove(currentClassName);
            }

            const targetTab = button.getAttribute("data-tab");
            container
                .querySelector(`#${targetTab}`)
                .classList.add(currentClassName);
        }

        for (let i = 0; i < tabButtons.length; i++) {
            tabButtons[i].addEventListener("click", () =>
                handleTabClick(tabButtons[i])
            );
        }
    }
}

document.addEventListener("DOMContentLoaded", initTabs);
