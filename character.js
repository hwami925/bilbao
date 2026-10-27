/* ========================================
   BILBAO — PERSONNEL ARCHIVE
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    // 캐릭터 정보 (임시 소개 문구)
    const characters = {
        bilbao: {
            name: "BILBAO",
            korean: "빌바오",
           	image: "./images/fullbody/00.png",
            description: "폐허가 된 세계에서 살아가며, 모두에게 동기를 심어준 소녀. 그녀에게는 아직 밝혀지지 않은 이야기가 있다."
        },
       
        revoli: {
            name: "REVOLI",
            korean: "레볼리",
            image: "./images/fullbody/01.png",
            description: "한 때는 전쟁을 이끌었던 대장이었지만 현재엔 폐허와 고철 속에서 살아가는 롯. 잿빛 세계에서 그의 이야기가 시작된다."
        },

        ribe: {
            name: "RIBE",
            korean: "리베",
            image: "./images/fullbody/02.png",
            description: "컴플리터 멤버 중에서 가장 감정이 풍부한 롯. 하지만 그 내면엔 또 다른 상처가 숨겨져 있다."
        },

        keiji: {
            name: "KEIJI",
            korean: "케이지",
           	image: "./images/fullbody/03.png",
            description: "빌바오의 엔지니어 스승. 대장의 말은 잘 듣지만 리베나 미나와 가끔 티격태격할 때가 있다."
        },

        mina: {
            name: "MINA",
            korean: "미나",
           image: "./images/fullbody/04.png",
            description: "폐허 속에서 자신만의 방식으로 살아가는 인물. 자신만의 신념(고집)이 올곧아 종종 케이지와 티격댄다."
        }
    };

       // 캐릭터 상세 프로필
    const characterProfiles = {
        bilbao: {
            gender: "여",
            species: "인간",
            ability: "X",
            age: "15살",
            height: "155cm",
            hobby: "기계 만지기, 아빠에게 쓰담쓰담 받기",
            personality: "매우 밝고 팀의 분위기 메이커. 다만 한편으로 남들에게 도움이 되기 위해 과도하게 노력할 때가 있다.",
            quote: "모든 일이 끝나면, 아빠하고 나, 단둘이서 여기에 다시 오자. 그리고 있었던 일을 모두 웃으면서 얘기하자."
        },

        revoli: {
            gender: "남",
            species: "롯(로봇)",
            ability: "염라",
            age: "15살",
            height: "185cm",
            hobby: "고철 공예, 요리",
            personality: "이성적이고 무뚝뚝한 편이며 책임감이 큰 편이다. 감정제어가 풀리면 점점 다양한 감정을 보여준다.",
            quote: "내 딸은 인간 계집이 아니라 빌바오다. 네가 함부로 입에 담아도 될 아이가 아니란 말이다."
        },

        ribe: {
            gender: "여",
            species: "롯(로봇)",
            ability: "현무",
            age: "",
            height: "163cm",
            hobby: "바느질, 바로 불 주물하기",
            personality: "팀 중에서 가장 감정 표현이 다양한 롯. 레볼리 다음으로 바오를 잘 챙기고, 전투에 있어서는 조금 소극적인 면을 보인다.",
            quote: "어, 쟤... 등 바뀐건 바뀐거야. 예전에는 내 가게에 와서 귀찮은 걸 집에 데려가게 되었다면서 나한테 맡기려 했으면서."
        },

        keiji: {
            gender: "남",
            species: "롯(로봇)",
            ability: "불가살이",
            age: "",
            height: "180cm",
            hobby: "기계 분해, 재조립",
            personality: "성격 자체가 온화하며 팀들과 두루두루 잘 지낸다. (미나 제외) 대신 진지할 땐 또 진지한 성격이다.",
            quote: "그래도 그 따뜻한 마음과 올곧은 생각, 마음에 들었다! 꼬맹이, 내 제자로 받아주도록 하지!"
        },

        mina: {
            gender: "여",
            species: "롯(로봇)",
            ability: "X",
            age: "",
            height: "165cm",
            hobby: "프로그램 뜯어보기",
            personality: "자기가 좋아하는 일이 아니면 딱히 나서지 않는 귀차니즘 성격. 남들에게 츳코미를 잘 거는 편이고, 착실히 팀을 생각하는 편이다.",
            quote: ""
        }
    };
    // HTML 요소 찾기
    const cards = document.querySelectorAll(".hanging-card");
    const overlay = document.getElementById("archive-overlay");
    const closeButton = document.querySelector(".archive-close");

    const nameElement = document.getElementById("archive-record-name");
    const koreanElement = document.getElementById("archive-record-korean");
    const descriptionElement = document.getElementById("archive-record-description");
   const imageElement = document.getElementById("archive-record-image");

    if (!overlay || !closeButton) return;

    let lastFocusedCard = null;

    // 기록부 열기
    function openRecord(key, card) {
        const character = characters[key];

        if (!character) return;

        nameElement.textContent = character.name;
        koreanElement.textContent = character.korean;
        descriptionElement.textContent = character.description;
       
       // 상세 프로필 표시
const profile = characterProfiles[key];

if (profile) {
    document.getElementById("archive-gender").textContent = profile.gender || "-";
    document.getElementById("archive-species").textContent = profile.species || "-";
    document.getElementById("archive-ability").textContent = profile.ability || "-";
    document.getElementById("archive-age").textContent = profile.age || "미상";
    document.getElementById("archive-height").textContent = profile.height || "-";
    document.getElementById("archive-hobby").textContent = profile.hobby || "-";
    document.getElementById("archive-personality").textContent = profile.personality || "-";
    document.getElementById("archive-quote").textContent = profile.quote || "기록 없음";
}
       
       imageElement.style.visibility = "hidden";

imageElement.onload = function () {
    imageElement.style.visibility = "visible";
};

imageElement.onerror = function () {
    imageElement.style.visibility = "visible";
};

imageElement.alt = character.korean + " 얼굴 이미지";
imageElement.src = character.image;

if (imageElement.complete) {
    imageElement.style.visibility = "visible";
}

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
