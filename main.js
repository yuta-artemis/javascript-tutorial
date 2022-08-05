(()=> {
const UnsplashAPI = {
    random: "https://source.unsplash.com/random/",
    search: "https://source.unsplash.com/featured/?",
}
// tab, pageを管理する配列
let tabs = [];
let pages = [];

// 全てのtabを非表示/無効化する
function disableTab() {
    tabs.forEach( elem => elem.classList.remove('active') );
    pages.forEach( elem => elem.classList.remove('active') );
}
// 渡されたtabと同じindexのpageを表示/有効化する
function enableTab( tab ) {
    tab.classList.add('active');
    let index = tabs.indexOf(tab);
    pages[index].classList.add('active');
}

// tab, pageを生成し管理用配列とdocumentへ追加
// 他のtabやpageを無効化し、生成したtabとpageを有効化する
function addNewTab( tabName ) {
    let tab = document.createElement('div');
        tab.classList.add('.history', 'active');
        tab.textContent = tabName;
    let page = document.createElement('div');
        page.classList.add('page', 'active');
    
    disableTab();

    document.querySelector('.history_area').appendChild(tab);
    document.querySelector('.draw_area').appendChild(page);

    tabs.push(tab);
    pages.push(page);

    return [tab, page];
}

// 検索ボタン押下時の処理
let search_word = document.querySelector('.search_word');
document.querySelector('.search_button').addEventListener('click', event => {
    // 検索語句の取得とクリア
    let value = search_word.value;
    search_word.value = "";
    // 検索語句が設定されているか確認
    let words = value.split(" ");
    words = words.filter( word => word != "" ).join(",");
    if (words == "") {
        return false;
    }

    // 検索語句をタブ名としてtab, pageの追加。
    let [tab, page] = addNewTab( words );

    // 検索語句から画像を50枚生成
    // pageに追加
    for (let i=0; i<50; i++) {
        let img = new Image();
        img.setAttribute('src', UnsplashAPI["search"] + words + "/" + Math.floor((Math.random() * 10000000)));
        page.appendChild(img);
    }
});

// 検索履歴押下時の処理
document.querySelector('.history_area').addEventListener('click', event => {
    if (event.target.tagName !== "DIV" || event.target.classList.contains('active')) {
        return ;
    }

    disableTab();
    enableTab(event.target);
});

// 初回表示時に、ランダムな画像を50枚表示させる
function init() {
    // サイコロをtabとして
    // 初回表示ページをpageとして登録
    let tab = document.querySelector('.random_icon');
    let page = document.querySelector('.random.page');
    tabs.push(tab);
    pages.push(page);

    // pageの中にランダムな画像を50枚生成
    function makeRandomImage( page ) {
        for (let i=0; i<50; i++) {
            let img = new Image();
            img.setAttribute('src', UnsplashAPI["random"] + Math.floor((Math.random() * 10000000)));
            page.appendChild(img);
        }
    }

    // pageの中から全ての子要素を消す
    function removeImages( page ) {
        Array.from( page.children ).forEach( elem => elem.remove() );
    }

    // サイコロ押下時の処理
    // tabを無効化
    // pageから子要素をすべて消し、ランダムな画像を50枚生成
    // tabを有効化
    tab.addEventListener('click', event => {
        disableTab();
        removeImages(page);
        makeRandomImage(page);
        enableTab(tab);
    });

    makeRandomImage(page);
}
init();

})();