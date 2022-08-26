class Base {
    constructor() {
        this.elem = document.createElement("div");
        this.showClassName = "show";
        this.hideClassName = "hide";
    }
    show() {
        this.elem.classList.remove(this.hideClassName);
        this.elem.classList.add(this.showClassName);
    }
    hide() {
        this.elem.classList.remove(this.showClassName);
        this.elem.classList.add(this.hideClassName);
    }
    getElement() {
        return this.elem;
    }
    setElement(elem) {
        this.elem = elem;
    }
}
class Tab extends Base {
    constructor(tabName) {
        super();

        this.elem.classList.add('tab');

        if (tabName) {
            this.setTabName(tabName);
        }
    }
    setTabName(tabName) {
        this.elem.textContent = tabName;
    }
}
class Panel extends Base {
    constructor() {
        super();

        this.elem.classList.add('panel');
    }
}

/*
 * tabとpanelを紐づけて管理するクラス
 */
class Page {
    constructor() {
        this.tabList = [];
        this.currentFocus = null;
    }

    setTabArea( tabArea ) {
        this.tabArea = tabArea;
    }
    setPanelArea( panelArea ) {
        this.panelArea = panelArea;
    }

    addTab(tabName, index) {
        const tab = new Tab(tabName);
        const panel = new Panel();
        // 新しいタブの挿入位置が指定されていなければ、挿入位置として末尾を指定する
        if (!index) {
            index = this.tabList.length;
        }

        this.tabList.splice(index, 0, [tab, panel]);
        // 新しく生成したタブにフォーカスする
        this.focus(index);
        // 新しく生成したタブとパネルを返す
        return [tab, panel];
    }
    removeTab(index) {
        const ret = this.tabList[index];
        if (!ret) {
            return;
        }
        // 削除するタブが現在開いているタブだった場合、先頭のタブにフォーカスする
        if (this.currentFocus === index) {
            this.focus(0);
        }
        // tabListからindex番目のタブを削除する
        this.tabList.splice(index, 1);
        // 削除したタブとパネルを返す
        return ret;
    }
    _unfocus() {
        // 現在開いているタブが存在しなければ何もしない
        if (this.currentFocus === null) {
            return;
        }
        // タブリストから現在開いているタブを取得する
        const [tab, panel] = this.tabList[this.currentFocus];
        tab.hide();
        panel.hide();
        this.currentFocus = null;
    }
    focus(index) {
        // 現在開いているタブを非表示にする
        this._unfocus();
        // 指定されたindexのタブを表示し、現在開いているタブとして設定する
        const [tab, panel] = this.tabList[index];
        tab.show();
        panel.show();
        this.currentFocus = index;
    }
    focusElement(tabElem) {
        const self = this;
        this.tabList.forEach((item, index) => {
            if (item[0].elem === tabElem) {
                self.focus(index);
            }
        });
    }
}

export { Tab, Panel, Page }