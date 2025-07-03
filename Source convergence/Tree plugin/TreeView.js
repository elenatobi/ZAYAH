// js/treeview.js

class TreeView {
    constructor(elementId, options = {}) {
        // Define default options as class properties
        this.openSymbol = "▼";
        this.closeSymbol = "▶";
        this.symbolPositionBefore = "5px"; // margin before the symbol
        this.symbolPositionAfter = "0px"; // margin after the symbol
        this.itemClass = ""; // custom class for list items
        this.onToggle = null; // callback function when an item is toggled
        this.lazyLoad = false; // flag for lazy loading

        // Merge default options with user-provided options
        Object.assign(this, options);

        this.treeElement = document.getElementById(elementId);
        if (!this.lazyLoad) {
            this.initTree(this.options.data);
        }
        if (this.lazyLoad) {
            this.attachLazyLoadListener();
        }
        this.attachEventListeners();
    }

    initTree(data = null) {
        if (data) {
            this.treeElement.innerHTML = this.buildTree(data);
        }
        this.treeElement.querySelectorAll('li').forEach(li => {
            if (li.querySelector('ul')) {
                const caret = document.createElement('span');
                caret.textContent = this.closeSymbol;
                caret.style.marginRight = this.symbolPositionBefore;
                caret.style.marginLeft = this.symbolPositionAfter;

                li.insertBefore(caret, li.firstChild);

                if (this.itemClass) {
                    li.classList.add(this.itemClass);
                }
            }
        });
    }

    buildTree(data) {
        let html = '<ul>';
        data.forEach(item => {
            html += `<li data-id="${item.id}">${item.name}`;
            if (item.children && !this.lazyLoad) {
                html += this.buildTree(item.children);
            } else if (item.children && this.lazyLoad) {
                html += '<ul style="display:none;"></ul>';
            }
            html += '</li>';
        });
        html += '</ul>';
        return html;
    }

    attachLazyLoadListener() {
        this.treeElement.addEventListener('click', (e) => {
            if (e.target.tagName === 'LI' && !e.target.classList.contains('loaded')) {
                e.target.classList.add('loaded');
                const childData = this.fetchChildren(e.target.dataset.id); // Assume this method fetches child nodes based on id
                const ul = e.target.querySelector('ul');
                ul.innerHTML = this.buildTree(childData);
                ul.style.display = 'block';
                this.attachEventListeners(); // Reattach event listeners for newly added items
            }
        });
    }

    fetchChildren(id) {
        // This method should be replaced with an actual data fetch
        // For demo purposes, returning a sample structure
        return [
            { id: `child-${id}-1`, name: `Child of ${id} - 1` },
            { id: `child-${id}-2`, name: `Child of ${id} - 2` }
        ];
    }

    attachEventListeners() {
        this.treeElement.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', (e) => {
                e.stopPropagation();
                const caret = li.querySelector('span');
                if (caret) {
                    li.classList.toggle('open');
                    caret.textContent = li.classList.contains('open') ? this.openSymbol : this.closeSymbol;
                    if (this.onToggle) {
                        this.onToggle(li);
                    }
                }
            });
        });
    }
}

// Sample data for eager loading
const sampleData = [
    {
        id: 'parent-1',
        name: 'Parent 1',
        children: [
            { id: 'child-1-1', name: 'Child 1' },
            { id: 'child-1-2', name: 'Child 2' }
        ]
    },
    {
        id: 'parent-2',
        name: 'Parent 2',
        children: [
            { id: 'child-2-1', name: 'Child 3' }
        ]
    }
];

// Initialize the TreeView with lazy loading
document.addEventListener('DOMContentLoaded', () => {
    const treeView = new TreeView('treeview', {
        openSymbol: "▼",
        closeSymbol: "▶",
        symbolPositionBefore: "5px",
        symbolPositionAfter: "10px",
        itemClass: "custom-item",
        onToggle: (item) => {
            console.log(`Toggled: ${item.textContent.trim()}`);
        },
        lazyLoad: true, // Change to true for lazy loading
        data: sampleData
    });
});
