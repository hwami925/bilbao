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
            title: "이야기의 시작",
            description: "모든 이야기가 시작된 순간.",
            image: ""
        },
        {
            chapter: "CHAPTER 02",
            title: "무너진 마음",
            description: "폐허 속에 남겨진 기억.",
            image: ""
        },
        {
            chapter: "CHAPTER 04",
            title: "작은 온기",
            description: "잿빛 세계에서 발견한 작은 온기.",
            image: ""
        },
        {
            chapter: "CHAPTER 06",
            title: "마주한 진실",
            description: "서로의 선택이 엇갈리는 순간.",
            image: ""
        },
        {
            chapter: "CHAPTER 08",
            title: "잿빛 속의 미소",
            description: "어둠 속에서도 사라지지 않는 미소.",
            image: ""
        },
        {
            chapter: "CHAPTER 11",
            title: "우리들의 시간",
            description: "함께하기에 더욱 소중한 시간.",
            image: ""
        }
    ];


    /* =====================================
       2. HTML 요소
    ===================================== */

    const cards = document.querySelectorAll(".artwork-card");

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


    /* =====================================
       3. 작품 표시
    ===================================== */

    function showArtwork(index) {

        currentIndex = (
            index + artworks.length
        ) % artworks.length;

        const artwork = artworks[currentIndex];

        chapterElement.textContent = artwork.chapter;
        titleElement.textContent = artwork.title;
        descriptionElement.textContent = artwork.description;

        // 이미지가 등록되어 있다면 표시
        if (artwork.image) {

            modalImage.src = artwork.image;
            modalImage.alt = artwork.title;
            modalImage.hidden = false;

            placeholder.hidden = true;

            // 다운로드 버튼
            downloadButton.href = artwork.image;

            const extension = artwork.image
                .split(".")
                .pop()
                .split("?")[0]
                .toLowerCase();

            const validExtension = /^(png|jpg|jpeg|webp|gif)$/;

            const fileExtension = validExtension.test(extension)
                ? extension
                : "png";

            downloadButton.download =
                `BILBAO_ARTWORK_${String(currentIndex + 1).padStart(3, "0")}.${fileExtension}`;

            downloadButton.hidden = false;

        } else {

            modalImage.removeAttribute("src");
            modalImage.hidden = true;

            placeholder.textContent =
                `ARTWORK ${String(currentIndex + 1).padStart(3, "0")}`;

            placeholder.hidden = false;

            downloadButton.hidden = true;
            downloadButton.removeAttribute("href");

        }

    }


    /* =====================================
       4. 팝업 열기
    ===================================== */

    function openArtwork(index, card) {

        lastFocusedCard = card;

        showArtwork(index);

        overlay.hidden = false;

        document.body.style.overflow = "hidden";

        closeButton.focus();

    }


    /* =====================================
       5. 팝업 닫기
    ===================================== */

    function closeArtwork() {

        overlay.hidden = true;

        document.body.style.overflow = "";

        if (lastFocusedCard) {
            lastFocusedCard.focus();
        }

    }


    /* =====================================
       6. 작품 클릭
    ===================================== */

    cards.forEach(card => {

        card.addEventListener("click", () => {

            const index = Number(card.dataset.artwork);

            if (
                Number.isInteger(index) &&
                index >= 0 &&
                index < artworks.length
            ) {
                openArtwork(index, card);
            }

        });

    });


    /* =====================================
       7. 이전 / 다음 작품
    ===================================== */

    prevButton.addEventListener("click", () => {

        showArtwork(currentIndex - 1);

    });

    nextButton.addEventListener("click", () => {

        showArtwork(currentIndex + 1);

    });


    /* =====================================
       8. 닫기
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

            // 팝업 외부로 키보드 포커스가 나가지 않도록
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

});
