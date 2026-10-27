/* ========================================
   BILBAO — MEMORY WALL
   GALLERY.JS
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       1. 작품 데이터
    ===================================== */

    const artworks = [
        {
            chapter: "PROLOGUE",
            title: "고철 위에 피어난 꽃",
            description: "주변 고철에 노을빛이 반사되면서 나도 모르게 고철 위에 피어난 꽃을 떠올리게 되었다.",
            image: "./images/gallery/01.jpg"
        },
        {
            chapter: "CHAPTER 01",
            title: "평화로운 나날, 다가오는 불안",
            description: "아, 그렇구나.. 그러니까 부부..는 아니라는 거지? 아, 아니 내가 무슨 소릴하는 거지.. 방금 건 못 들은 걸로 해줘..",
            image: "./images/gallery/02.jpg"
        },
        {
            chapter: "CHAPTER 02",
            title: "자신을 가둔 안드로이드, 케이지",
            description: "그런 우리에게 대답이라도 하듯 비가 쏟아지기 시작했고, 케이지와 나의 볼에는 눈물이 아닌.. 빗물이 흘러내렸다.",
            image: "./images/gallery/03.jpg"
        },
        {
            chapter: "CHAPTER 03",
            title: "센터 그리고 위기",
            description: "순간 머리를 잃은 채 멈춰 있는 몸이 움직이더니 칼을 휘두르며 자리를 벗어나던 녀석에게 달려가 그의 몸을 베어냈다.",
            image: "./images/gallery/04.jpg"
        },
        {
            chapter: "CHAPTER 04",
            title: "계획 그리고 파트너",
            description: "아빠, 흐흑... 아빠... 흐흑.. | 그래, 그래. 여기 있으니까 아무 걱정하지 않아도 된단다.",
            image: "./images/gallery/05.jpg"
        },
        {
            chapter: "CHAPTER 06",
            title: "암시장, 그리고 새로운 만남",
            description: "그럼, 이 자리에서 넌 내 손에 죽어야겠군 | ...하?",
            image: "./images/gallery/06.jpg"
        },
        {
            chapter: "ARTWORK 07",
            title: "너의 무기는 곧 나의 먹이가 된다",
            description: "엿이나 먹어. 이 새끼야.",
            image: "./images/gallery/07.jpg"
        },
        {
            chapter: "ARTWORK 08",
            title: "로봇과 인간, 아빠와 딸",
            description: "모든 일이 끝나면, 아빠하고 나, 단둘이서 여기에 다시 오자. 그리고 있었던 일들 모두 웃으면서 얘기하자.",
            image: "./images/gallery/08.jpg"
        },
        {
            chapter: "ARTWORK 10",
            title: "최종 전투, 혹은 시작",
            description: "그럼 지금부터 키바우의 재판을 시작하겠다.",
            image: "./images/gallery/09.jpg"
        },
        {
            chapter: "ARTWORK 11",
            title: "앞을 향해 미래를 향해",
            description: "안녕, 부산. 그동안 나와 바오에게 안전한 보금자리를 빌려줘서 정말 고마웠다.",
            image: "./images/gallery/10.jpg"
        }
    ];


    /* =====================================
       2. HTML 요소
    ===================================== */

    const grid = document.querySelector(".artwork-grid");

    const overlay = document.getElementById("artwork-overlay");

    const closeButton = document.querySelector(".artwork-close");
    const prevButton = document.querySelector(".artwork-prev");
    const nextButton = document.querySelector(".artwork-next");

    const modalImage = document.getElementById("modal-artwork-img");
    const placeholder = document.getElementById("modal-artwork-placeholder");

    const chapterElement = document.getElementById("modal-artwork-chapter");
    const titleElement = document.getElementById("modal-artwork-title");
    const descriptionElement = document.getElementById("modal-artwork-description");

    const downloadButton = document.getElementById("artwork-download");

    if (
        !grid ||
        !overlay ||
        !closeButton ||
        !prevButton ||
        !nextButton ||
        !modalImage ||
        !placeholder ||
        !chapterElement ||
        !titleElement ||
        !descriptionElement ||
        !downloadButton
    ) {
        return;
    }

    let currentIndex = 0;
    let lastFocusedCard = null;
    let imageRequestId = 0;


    /* =====================================
       3. 작품 카드 자동 생성
    ===================================== */

    grid.innerHTML = "";

    artworks.forEach((artwork, index) => {

        const number = String(index + 1).padStart(3, "0");

        const card = document.createElement("button");

        card.className = "artwork-card";
        card.type = "button";
        card.dataset.artwork = index;

        card.innerHTML = `
            <div class="artwork-image">
                <img
                    src="${artwork.image}"
                    alt="${artwork.title}"
                    loading="lazy"
                    decoding="async"
                    style="
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        display: block;
                    "
                >
            </div>

            <div class="artwork-info">
                <span></span>
                <h2></h2>
            </div>
        `;

        const image = card.querySelector(".artwork-image img");
        const chapter = card.querySelector(".artwork-info span");
        const title = card.querySelector(".artwork-info h2");

        chapter.textContent = artwork.chapter;
        title.textContent = artwork.title;

        image.onerror = () => {
            image.style.display = "none";

            const fallback = document.createElement("span");
            fallback.textContent = `ARTWORK ${number}`;

            image.parentElement.appendChild(fallback);
        };

        card.addEventListener("click", () => {
            openArtwork(index, card);
        });

        grid.appendChild(card);

    });


    /* =====================================
       4. 작품 표시
    ===================================== */

    function showArtwork(index) {

        currentIndex =
            (index + artworks.length) % artworks.length;

        const artwork = artworks[currentIndex];

        chapterElement.textContent = artwork.chapter;
        titleElement.textContent = artwork.title;
        descriptionElement.textContent = artwork.description;

        // 이전 이미지 로딩 무효화
        const requestId = ++imageRequestId;

        // 기존 이미지 숨기기
        modalImage.hidden = true;
        modalImage.removeAttribute("src");

        placeholder.textContent = "LOADING...";
        placeholder.hidden = false;

        downloadButton.hidden = true;
        downloadButton.removeAttribute("href");

        if (!artwork.image) {
            placeholder.textContent = "IMAGE NOT FOUND";
            return;
        }

        // 새 이미지 미리 로딩
        const newImage = new Image();

        newImage.onload = () => {

            // 다른 작품으로 이동했다면 무시
            if (requestId !== imageRequestId) return;

            modalImage.src = artwork.image;
            modalImage.alt = artwork.title;

            modalImage.hidden = false;
            placeholder.hidden = true;

            // 다운로드 설정
            downloadButton.href = artwork.image;

            const extension = artwork.image
                .split(".")
                .pop()
                .split("?")[0]
                .toLowerCase();

            const validExtension = /^(png|jpg|jpeg|webp|gif)$/;

            const fileExtension = validExtension.test(extension)
                ? extension
                : "jpg";

            downloadButton.download =
                `BILBAO_ARTWORK_${String(currentIndex + 1).padStart(3, "0")}.${fileExtension}`;

            downloadButton.hidden = false;

        };

        newImage.onerror = () => {

            if (requestId !== imageRequestId) return;

            placeholder.textContent = "IMAGE NOT FOUND";

        };

        newImage.src = artwork.image;

    }


    /* =====================================
       5. 팝업 열기
    ===================================== */

    function openArtwork(index, card) {

        lastFocusedCard = card;

        showArtwork(index);

        overlay.hidden = false;
        document.body.style.overflow = "hidden";

        closeButton.focus();

    }


    /* =====================================
       6. 팝업 닫기
    ===================================== */

    function closeArtwork() {

        imageRequestId++;

        overlay.hidden = true;
        document.body.style.overflow = "";

        if (lastFocusedCard) {
            lastFocusedCard.focus();
        }

    }


    /* =====================================
       7. 이전 / 다음
    ===================================== */

    prevButton.addEventListener("click", () => {
        showArtwork(currentIndex - 1);
    });

    nextButton.addEventListener("click", () => {
        showArtwork(currentIndex + 1);
    });


    /* =====================================
       8. 팝업 닫기 이벤트
    ===================================== */

    closeButton.addEventListener("click", closeArtwork);

    overlay.addEventListener("click", event => {

        if (event.target === overlay) {
            closeArtwork();
        }

    });


    /* =====================================
       9. 키보드 조작
    ===================================== */

    document.addEventListener("keydown", event => {

        if (overlay.hidden) return;

        if (event.key === "Escape") {

            closeArtwork();

        } else if (event.key === "ArrowLeft") {

            showArtwork(currentIndex - 1);

        } else if (event.key === "ArrowRight") {

            showArtwork(currentIndex + 1);

        } else if (event.key === "Tab") {

            const focusable = Array.from(
                overlay.querySelectorAll(
                    'button:not([disabled]):not([hidden]), a[href]:not([hidden])'
                )
            ).filter(element => element.getClientRects().length > 0);

            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {

                event.preventDefault();
                last.focus();

            } else if (
                !event.shiftKey &&
                document.activeElement === last
            ) {

                event.preventDefault();
                first.focus();

            }

        }

    });


    /* =====================================
       10. 작품 개수 자동 표시
    ===================================== */

    const artworkCount = document.querySelector(".gallery-intro span");

    if (artworkCount) {
        artworkCount.textContent =
            `TOTAL ARTWORKS / ${String(artworks.length).padStart(2, "0")}`;
    }

});
