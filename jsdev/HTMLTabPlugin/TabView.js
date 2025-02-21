class TabPanel {
    constructor() {
        this.tabs = [];
        this.headersRow = document.getElementById('tabHeaders');
        this.contentsRow = document.getElementById('tabContents');
    }

    addTab(title, content) {
        const tabId = this.tabs.length;
        this.tabs.push({ title, content });
        this.renderTab(tabId);
    }

    removeTab(index) {
        this.tabs.splice(index, 1);
        this.renderTabs();
    }

    updateTab(index, newTitle, newContent) {
        this.tabs[index] = { title: newTitle, content: newContent };
        this.renderTabs();
    }

    switchTabs(index1, index2) {
        [this.tabs[index1], this.tabs[index2]] = [this.tabs[index2], this.tabs[index1]];
        this.renderTabs();
    }

    renderTab(index) {
        const { title, content } = this.tabs[index];
        
        const headerCell = document.createElement('td');
        headerCell.innerText = title;
        headerCell.addEventListener('click', () => this.selectTab(index));
        this.headersRow.appendChild(headerCell);

        const contentCell = document.createElement('td');
        contentCell.innerText = content;
        contentCell.style.display = 'none';
        this.contentsRow.appendChild(contentCell);
    }

    renderTabs() {
        this.headersRow.innerHTML = '';
        this.contentsRow.innerHTML = '';
        this.tabs.forEach((tab, index) => this.renderTab(index));
    }

    selectTab(index) {
        Array.from(this.headersRow.children).forEach((cell, idx) => {
            cell.classList.toggle('active', idx === index);
        });
        Array.from(this.contentsRow.children).forEach((cell, idx) => {
            cell.style.display = idx === index ? 'table-cell' : 'none';
        });
    }
}

const tabPanel = new TabPanel();
tabPanel.addTab('Tab 1', 'Content 1');
tabPanel.addTab('Tab 2', 'Content 2');
tabPanel.addTab('Tab 3', 'Content 3');
tabPanel.selectTab(0);
