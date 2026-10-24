/* ========================================
   BILBAO — PERSONNEL ARCHIVE
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    // 캐릭터 정보 (임시 소개 문구)
    const characters = {
        revoli: {
            name: "REVOLI",
            korean: "레볼리",
            description: "폐허와 고철 속에서 살아가는 로봇. 잿빛 세계에서 그의 이야기가 시작된다."
        },

        bilbao: {
            name: "BILBAO",
            korean: "빌바오",
            description: "폐허가 된 세계에서 살아가는 소녀. 그녀에게는 아직 밝혀지지 않은 이야기가 있다."
        },

        ribe: {
            name: "RIBE",
            korean: "리베",
            description: "쉽게 자신의 감정을 드러내지 않는 인물. 차가운 태도 뒤에는 또 다른 모습이 숨어 있다."
        },

        keiji: {
            name: "KEIJI",
            korean: "케이지",
            description: "동료들과 함께 위험한 세계를 살아가는 인물."
        },

        yuri: {
            name: "YURI",
            korean: "유리",
            description: "폐허 속에서 자신만의 방식으로 살아가는 인물."
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
