(() => {
    let UnsplashAPI = "https://source.unsplash.com/featured/?";

    let button = document.getElementById("search_button");
    let input = document.getElementById("search_word");

    let draw_area = document.getElementById("draw_area");

    button.addEventListener("click", () => {
        let word = input.value.split(" ");
        word = word.filter(w => {
            if (w != "") {
                return w;
            }
        });

        if (word.length == 0 ) {
            return ;
        }

        let url = UnsplashAPI + word.join(",");

        let div = document.createElement("div");
        div.classList.add("row");

        for (let i = 0; i < 5; i++) {
            let img = new Image();
            img.setAttribute("src", url + "/" + Math.floor(Math.random() * (new Date()).getTime()) );
            img.width = Math.floor(window.innerWidth / 5);
            img.height = Math.floor(window.innerWidth / 5);
            div.appendChild(img);
        }

        draw_area.insertBefore(div, draw_area.firstElementChild);
        input.value = "";
    });
})();
