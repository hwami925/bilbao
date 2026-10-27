/* ========================================
   BILBAO — PERSONNEL ARCHIVE
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    // 캐릭터 정보 (임시 소개 문구)
    const characters = {
        revoli: {
            name: "REVOLI",
            korean: "레볼리",
            image: "./images/characters/portraits/01.png",
            description: "한 때는 전쟁을 이끌었던 대장이었지만 현재엔 폐허와 고철 속에서 살아가는 롯. 잿빛 세계에서 그의 이야기가 시작된다."
        },

        bilbao: {
            name: "BILBAO",
            korean: "빌바오",
           	image: "./images/characters/portraits/00.png",
            description: "폐허가 된 세계에서 살아가며, 모두에게 동기를 심어준 소녀. 그녀에게는 아직 밝혀지지 않은 이야기가 있다."
        },

        ribe: {
            name: "RIBE",
            korean: "리베",
           	image: "./images/characters/portraits/02.png",
            description: "컴플리터 멤버 중에서 가장 감정이 풍부한 롯. 하지만 그 내면엔 또 다른 상처가 숨겨져 있다."
        },

        keiji: {
            name: "KEIJI",
            korean: "케이지",
           	image: "./images/characters/portraits/03.png",
            description: "빌바오의 엔지니어 스승. 대장의 말은 잘 듣지만 리베나 미나와 가끔 티격태격할 때가 있다."
        },

        MINA: {
            name: "MINA",
            korean: "미나",
           image: "./images/characters/portraits/04.png",
            description: "폐허 속에서 자신만의 방식으로 살아가는 인물. 자신만의 신념(고집)이 올곧아 종종 케이지와 티격댄다."
        }
    };

    // HTML 요소 찾기
    const cards = document.querySelectorAll(".hanging-card");
    const overlay = document.getElementById("archive-overlay");
    const closeButton = document.querySelector(".archive-close");

    const nameElement = document.getElementById("archive-record-name");
    const koreanElement = document.getElementById("archive-record-korean");
    const descriptionElement = document.getElementById("archive-record-description");

    if (!overlay || !closeButton) return;

    let lastFocusedCard = null;

    // 기록부 열기
    function openRecord(key, card) {
        const character = characters[key];

        if (!character) return;

        nameElement.textContent = character.name;
        koreanElement.textContent = character.korean;
        descriptionElement.textContent = character.description;

        lastFocusedCard = card;

        overlay.hidden = false;
        document.body.style.overflow = "hidden";

        closeButton.focus();
    }

    // 기록부 닫기
    function closeRecord() {
        overlay.hidden = true;
        document.body.style.overflow = "";

        if (lastFocusedCard) {
            lastFocusedCard.focus();
        }
    }

    // 명찰 클릭 이벤트
    cards.forEach(card => {
        card.addEventListener("click", () => {
            openRecord(card.dataset.character, card);
        });
    });

    // X 버튼으로 닫기
    closeButton.addEventListener("click", closeRecord);

    // 팝업 바깥 클릭으로 닫기
    overlay.addEventListener("click", event => {
        if (event.target === overlay) {
            closeRecord();
        }
    });

    // ESC 키로 닫기
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !overlay.hidden) {
            closeRecord();
        }
    });

    // 팝업이 열린 동안 키보드 포커스 유지
    overlay.addEventListener("keydown", event => {
        if (event.key !== "Tab") return;

        const focusableElements = Array.from(
            overlay.querySelectorAll(
                'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
        );

        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });

});
