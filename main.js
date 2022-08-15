(() => {
"use strict";

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

/*
 * 重複しないランダムな文字列を生成、管理するクラス
 */
class UUID {
    constructor() {
        this.charset = [
            'abcdefghijklmnopqrstuvwxyz',
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            '0123456789'
        ].join('');
        // 重複監視用の配列
        this.memory = {};
    }
    generate(length) {
        let result;
        const memory = this.initMemory(length);
        // 生成したuuidの数が生成できる数を上回った場合、falseを返す
        if (memory.length >= this.charset.length ** length) {
            return false;
        }

        do {
            const arr = new Uint32Array(length);
            const randomArr = Array.from(crypto.getRandomValues(arr));
            result = randomArr.map((n) => {
                return this.charset[n % this.charset.length];
            }).join('');
        // 生成した値がmemoryに含まれていたら、生成を繰り返す
        } while(memory.includes(result));

        memory.push(result);
        return result;
    }
    initMemory(key) {
        if (!this.memory[key]) {
            this.memory[key] = [];
        }
        return this.memory[key];
    }
}


function main() {
    // UnsplashAPIのURL定義
    const UnsplashAPI = {
        random: "https://source.unsplash.com/random/",
        search: "https://source.unsplash.com/featured/?",
    }

    // 50枚画像を生成して、指定のノードに挿入する
    // srcの末尾にはランダムな整数を与えてUnsplashの画像がキャッシュされないようにする
    function insertImage50(target, src) {
        const uuid = new UUID();
        for (let i=0; i<50; i++) {
            let img = document.createElement('img');
            img.setAttribute('src', src + uuid.generate(10));
            target.appendChild(img);
        }
    }

    // 履歴を表示するエリア、画像を表示させるエリアの取得
    const history_area = document.querySelector('#history');
    const draw_area = document.querySelector('#main');

    const page = new Page();
    page.setTabArea(history_area);
    page.setPanelArea(draw_area);

    // 履歴をクリックしたときの処理
    history_area.addEventListener('click', event => {
        const target = event.target;
        if (!target.classList.contains('tab')) {
            return ;
        }
        if (target.classList.contains('hide')) {
            page.focusElement(target);
        }
    });

    // 検索実行時の処理
    const form = document.querySelector('#search_form');
    const input = document.querySelector('#search_input');
    function onSubmit(event) {
        event.preventDefault();
        // 検索語句の取得とクリア
        const value = input.value;
        input.value = "";
        // 検索語句が空の場合、処理を終える
        let words = value.split(" ");
        words = words.filter( word => word != "" ).join(",");
        if (words == "") {
            return false;
        }
        
        const [tab, panel] = page.addTab(words);
        insertImage50(panel.elem, UnsplashAPI["search"] + words + "/");
        page.tabList.slice(1).forEach(item => {
            page.tabArea.appendChild( item[0].elem );
            page.panelArea.appendChild( item[1].elem );
        });
    }
    form.addEventListener('submit', onSubmit);


    // tabとpanelを生成
    // tabListの0番目＝現在生成したtabのelemをrando_iconにすり替えpageに管理させる
    const [tab, panel] = page.addTab();
    page.tabList[0][0].elem = document.querySelector('#random_button');
    page.panelArea.appendChild(panel.elem);

    // ランダムページの表示
    function makeRandomImage() {
        // ランダム表示をするときに画像の一括削除を用意にするため、wrapperとしてdivを作成
        // その子要素としてimgを挿入
        const div = document.createElement('div');
        insertImage50(div, UnsplashAPI["random"]);
        panel.elem.appendChild(div);
    }
    makeRandomImage();

    // ランダムアイコンをクリックしたときの処理
    document.querySelector('#random_button').addEventListener('click', event => {
        const target = event.target;
        page.focus(0);
        panel.elem.firstChild.remove();
        makeRandomImage();
    });
}
main();

})();