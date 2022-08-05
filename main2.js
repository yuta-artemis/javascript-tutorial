(() => {
    class Tab {
        constructor() {
            let tab = document.createElement('div');
            this.tab = tab;
        }
        getElement() {
            return this.tab;
        }
        setName(tabName) {
            this.tab.textContent = tabName;
        }
        remove() {
            this.tab.remove();
        }
        focus() {
            this.tab.classList.add('active');
        }
        unfocus() {
            this.tab.classList.remove('active');
        }
    }
    
    class Page {
        constructor() {
            let page = document.createElement('div');
            this.page = page;
        }
        getElement() {
            return this.page;
        }
        remove() {
            this.page.remove();
        }
        focus() {
            this.page.classList.add('active');
        }
        unfocus() {
            this.page.classList.remove('active');
        }
    }

    class Board {
        constructor() {
            this.tabs = [];
            this.tab_elements = [];
            this.pages = [];
    
            this.tab_area  = document.querySelector('.history');
            this.page_area = document.querySelector('.draw_area');
    
            let self = this;
            this.tab_area.addEventListener('click', event => {
                let index = self.tab_elements.indexOf(event.target);
                if (index < 0 || event.target.classList.contains('active')) {
                    return ;
                }
                self.unfocus();
                self.focus(index);
            });
        }
    
        addNewPage( tabName ) {
    
            let tab = new Tab();
            tab.setName(tabName);
            let page = new Page();
    
            this.tabs.push(tab);
            this.tab_elements(tab.getElement());
            this.page.push(page);
    
            this.unfocus();
    
            tab.focus();
            page.focus();
    
            this.tab_area.appendChild(tab.getElement());
            this.page_area.appendChild(page.getElement());
        }
    
        unfocus() {
            this.tabs.forEach( tab => tab.unfocus() );
            this.pages.forEach( page => page.unfocus() );
        }
    
        focus(index) {
            this.unfocus();
            tabs[index].focus();
            pages[index].focus();
        }
    }


    let board = new Board();
})();