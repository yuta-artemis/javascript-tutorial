(() => {
    let UnsplashAPI = "https://source.unsplash.com/featured/?";

    let button = document.querySelector(".search_button");
    let input = document.querySelector(".search_word");

    let history_area = document.querySelector('.history_area');

    let draw_area = document.querySelector(".draw_area");


    button.addEventListener("click", () => {
        // inputから検索語句を取得
        // 空白で分割し配列にしたあと、空の検索語句をfilterで削除
        // 検索語句が何もなければ処理を終える
        // 検索語句があればAPIのbaseURLに加え、表示用のURLを生成する
        let word = input.value.split(" ");
        input.value = "";
        word = word.filter(w => {
            if (w != "") {
                return w;
            }
        });
        if (word.length == 0 ) {
            return ;
        }
        word = word.join(",");
        let url = UnsplashAPI + word;

        let history = document.createElement('span');
        history.textContent = word;
        history.addEventListener('click', event => {
            event.preventDefault();
            let historys = document.querySelectorAll('.history_area span');
            hisotrys = Array.from( historys );
            let index = hisotrys.indexOf(event.target);
            let active = document.querySelector('.active');
            if (active) {
                active.classList.remove('active');
            }
            let page = document.querySelectorAll('.page')[index];
            if (page) {
                page.classList.add('active');
            }
        });
        history_area.appendChild(history);

        // unsplashで取得した画像50枚を表示するpageを作成
        // .activeがついているpageを探し、.activeを削除
        // 新しく作成したpageに.activeを付与
        let active_page = document.querySelector('.active');
        if (active_page) {
            active_page.classList.remove('active');
        }
        let page = document.createElement('div');
        page.classList.add('page', 'active');


        // 50枚画像を生成し、pageに追加する
        for (let i = 0; i < 50; i++) {
            let img = new Image();
            img.setAttribute("src", url + "/" + Math.floor(Math.random() * (new Date()).getTime()) );
            page.appendChild(img);
        }

        // pageを表示領域に追加
        draw_area.appendChild(page);
        
    });
})();
