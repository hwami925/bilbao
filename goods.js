/* ========================================
   BILBAO — OFFICIAL GOODS
   GOODS.JS
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       1. 상품 데이터
       확정된 상품 가격
    ===================================== */
   
const SHIPPING_FEE = 3000;
   
   /* 구글 스프레드시트 주문 접수 서버 */
const ORDER_API_URL =
    "https://script.google.com/macros/s/AKfycbzNTSdLCMtzub2A8IqjFzm3wZeNF-ysrsoyN42TkJHwZSw2_u4fXsVjyLHfr03fYNkR/exec";
   
  /* =====================================
   BILBAO GOODS — 상품 데이터
===================================== */

const products = {

    /* 엽서 8장 세트 */
    postcard: {
        name: "일러스트 엽서 8장 세트",
        price: 6000
    },

    /* 일반 포토카드 5장 세트 */
    photocard: {
        name: "일반 포토카드 5장 세트",
        price: 3000
    },

    /* 투명 포토카드 5장 세트 */
    clearcard: {
        name: "투명 포토카드 5장 세트",
        price: 3500
    },

    /* 카드택 */
    cardtag: {
        name: "캐릭터 카드택",
        price: 1000
    },

    /* 띠부스티커 10장 선택 세트 */
    sticker_select: {
        name: "띠부스티커 10장 선택 세트",
        price: 7000
    },

    /* 띠부스티커 30장 풀세트 */
    sticker_full: {
        name: "띠부스티커 30장 풀세트",
        price: 20000
    }

};


    /* =====================================
       2. HTML 요소
    ===================================== */

    const productCards = document.querySelectorAll(
        ".goods-product"
    );

    const selectedCountElement = document.getElementById(
        "order-selected-count"
    );

    const totalPriceElement = document.getElementById(
        "order-total-price"
    );
   
   const shippingPriceElement = document.getElementById(
    "order-shipping-price"
);

    const nameInput = document.getElementById(
        "order-name"
    );

    const depositorInput = document.getElementById(
        "order-depositor"
    );

    const orderForm = document.getElementById(
        "goods-order-form"
    );

    const submitButton = document.querySelector(
        ".goods-submit"
    );


    /* =====================================
       3. 수량값 정리
    ===================================== */

    function normalizeQuantity(input) {

        const parsed = Number(input.value);

        const quantity = Number.isFinite(parsed)
            ? Math.min(99, Math.max(1, Math.trunc(parsed)))
            : 1;

        input.value = quantity;

        return quantity;

    }


    /* =====================================
       4. 주문 요약 업데이트
    ===================================== */

    function updateOrderSummary() {

        let totalQuantity = 0;
        let totalPrice = 0;

        let hasUnknownPrice = false;

        productCards.forEach(card => {

            const checkbox = card.querySelector(
                ".goods-checkbox"
            );

            const quantityInput = card.querySelector(
                ".quantity-input"
            );

            if (!checkbox || !quantityInput) return;

            if (!checkbox.checked) return;

            const productId = checkbox.dataset.product;
            const product = products[productId];

            if (!product) return;

            const quantity = normalizeQuantity(quantityInput);

            totalQuantity += quantity;

            if (
                typeof product.price === "number" &&
                Number.isFinite(product.price) &&
                product.price >= 0
            ) {

                totalPrice += product.price * quantity;

            } else {

                hasUnknownPrice = true;

            }

        });


        /* 선택한 상품 수량 */

        if (selectedCountElement) {

            selectedCountElement.textContent =
                `${totalQuantity}개`;

        }


/* 배송비 계산 */

const shippingFee = totalQuantity > 0 ? SHIPPING_FEE : 0;

if (shippingPriceElement) {
    shippingPriceElement.textContent =
        `${shippingFee.toLocaleString("ko-KR")}원`;
}

/* 최종 결제 금액 */

if (totalPriceElement) {

    if (totalQuantity === 0) {

        totalPriceElement.textContent = "0원";

    } else if (hasUnknownPrice) {

        totalPriceElement.textContent = "가격 미정";

    } else {

        const finalPrice = totalPrice + shippingFee;

        totalPriceElement.textContent =
            `${finalPrice.toLocaleString("ko-KR")}원`;

    }

}

    }


    /* =====================================
       5. 상품별 이벤트
    ===================================== */

    productCards.forEach(card => {

        const checkbox = card.querySelector(
            ".goods-checkbox"
        );

        const quantityInput = card.querySelector(
            ".quantity-input"
        );

        const minusButton = card.querySelector(
            ".quantity-minus"
        );

        const plusButton = card.querySelector(
            ".quantity-plus"
        );

        if (
            !checkbox ||
            !quantityInput ||
            !minusButton ||
            !plusButton
        ) {
            return;
        }


        /* 체크박스 선택 */

        checkbox.addEventListener("change", () => {

            updateOrderSummary();

        });


        /* 수량 감소 */

        minusButton.addEventListener("click", () => {

            const quantity = normalizeQuantity(quantityInput);

            quantityInput.value = Math.max(1, quantity - 1);

            updateOrderSummary();

        });


        /* 수량 증가 */

        plusButton.addEventListener("click", () => {

            const quantity = normalizeQuantity(quantityInput);

            quantityInput.value = Math.min(99, quantity + 1);

            updateOrderSummary();

        });


        /* 직접 수량 입력 */

        quantityInput.addEventListener("input", () => {

            updateOrderSummary();

        });

        quantityInput.addEventListener("change", () => {

            normalizeQuantity(quantityInput);

            updateOrderSummary();

        });

    });


    /* =====================================
       6. 주문자 이름 → 입금자명 자동 입력
    ===================================== */

    if (nameInput && depositorInput) {

        let depositorEdited = false;

        depositorInput.addEventListener("input", () => {

            depositorEdited = true;

        });

        nameInput.addEventListener("input", () => {

            if (!depositorEdited) {

                depositorInput.value = nameInput.value;

            }

        });

    }


    /* =====================================
       7. 주문 제출 방지
       현재는 테스트 단계
    ===================================== */

    if (submitButton) {

        submitButton.disabled = true;

        submitButton.textContent = "주문 신청 준비 중";

    }

    if (orderForm) {

        orderForm.addEventListener("submit", event => {

            event.preventDefault();

            alert(
                "현재는 주문 접수를 준비 중입니다."
            );

        });

    }


    /* =====================================
       8. 초기 주문 요약
    ===================================== */
/* ========================================
   9. 띠부스티커 디자인 선택 기능
======================================== */

const stickerOpenButton = document.getElementById("sticker-open-button");
const stickerModal = document.getElementById("sticker-modal");
const stickerModalClose = document.getElementById("sticker-modal-close");
const stickerModalBackdrop = document.getElementById("sticker-modal-backdrop");
const stickerDesignGrid = document.getElementById("sticker-design-grid");
const stickerSelectedCount = document.getElementById("sticker-selected-count");
const stickerConfirmButton = document.getElementById("sticker-confirm-button");
const stickerSelectionSummary = document.getElementById("sticker-selection-summary");

const stickerCheckbox = document.querySelector(
    '.goods-checkbox[data-product="sticker_select"]'
);
const stickerCard = stickerCheckbox?.closest(".goods-product");
const stickerSetQuantityInput = stickerCard?.querySelector(".quantity-input");

const STICKERS_PER_SET = 10;
const stickerDesigns = Array.from({ length: 30 }, (_, index) => ({
    id: index + 1,
    name: `스티커 ${String(index + 1).padStart(2, "0")}`
}));

let stickerDraft = Array(30).fill(0);
let stickerSaved = Array(30).fill(0);
let previousFocusedElement = null;

function getStickerLimit() {
    const sets = stickerSetQuantityInput
        ? normalizeQuantity(stickerSetQuantityInput)
        : 1;
    return sets * STICKERS_PER_SET;
}

function getStickerTotal(quantities) {
    return quantities.reduce((sum, count) => sum + count, 0);
}

// 기존 HTML의 '/ 10장' 문구를 동적 표시 요소로 한 번만 교체한다.
const stickerCountLabel = stickerSelectedCount?.parentElement;
let stickerLimitLabel = null;
if (stickerCountLabel && stickerSelectedCount) {
    for (const node of [...stickerCountLabel.childNodes]) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.includes("/ 10장")) {
            node.textContent = node.textContent.replace(/\/\s*10장/, "");
        }
    }
    stickerLimitLabel = document.createElement("span");
    stickerLimitLabel.id = "sticker-selection-limit";
    stickerSelectedCount.after(stickerLimitLabel);
}

function updateStickerCount() {
    const total = getStickerTotal(stickerDraft);
    const limit = getStickerLimit();
    if (stickerSelectedCount) stickerSelectedCount.textContent = total;
    if (stickerLimitLabel) stickerLimitLabel.textContent = ` / ${limit}장`;
    if (stickerConfirmButton) stickerConfirmButton.disabled = total !== limit;
}

function renderStickerDesigns() {
    if (!stickerDesignGrid) return;
    stickerDesignGrid.replaceChildren();

    stickerDesigns.forEach((sticker, index) => {
        const card = document.createElement("div");
        card.className = "sticker-design-card";

        const image = document.createElement("div");
        image.className = "sticker-design-image";
        const placeholder = document.createElement("span");
        placeholder.textContent = String(sticker.id).padStart(2, "0");
        placeholder.style.color = "#555";
        placeholder.style.fontSize = "28px";
        placeholder.style.fontWeight = "700";
        image.appendChild(placeholder);

        const name = document.createElement("p");
        name.className = "sticker-design-name";
        name.textContent = sticker.name;

        const controls = document.createElement("div");
        controls.className = "sticker-design-quantity";
        const minus = document.createElement("button");
        minus.type = "button";
        minus.textContent = "−";
        minus.setAttribute("aria-label", `${sticker.name} 수량 감소`);
        const count = document.createElement("span");
        count.textContent = stickerDraft[index];
        const plus = document.createElement("button");
        plus.type = "button";
        plus.textContent = "+";
        plus.setAttribute("aria-label", `${sticker.name} 수량 증가`);

        minus.addEventListener("click", () => {
            if (stickerDraft[index] === 0) return;
            stickerDraft[index]--;
            count.textContent = stickerDraft[index];
            updateStickerCount();
        });
        plus.addEventListener("click", () => {
            if (getStickerTotal(stickerDraft) >= getStickerLimit()) return;
            stickerDraft[index]++;
            count.textContent = stickerDraft[index];
            updateStickerCount();
        });

        controls.append(minus, count, plus);
        card.append(image, name, controls);
        stickerDesignGrid.appendChild(card);
    });
    updateStickerCount();
}

function updateStickerSummary() {
    if (!stickerSelectionSummary) return;
    const savedTotal = getStickerTotal(stickerSaved);
    const limit = getStickerLimit();
    if (savedTotal === 0) {
        stickerSelectionSummary.textContent = "아직 선택한 디자인이 없습니다.";
        return;
    }
    const names = stickerSaved
        .map((count, index) => count > 0 ? `${stickerDesigns[index].name} × ${count}` : null)
        .filter(Boolean)
        .join(", ");
    stickerSelectionSummary.textContent = savedTotal === limit
        ? `선택 완료 (${savedTotal}장): ${names}`
        : `수량 변경으로 재선택 필요 (${savedTotal}/${limit}장): ${names}`;
}

function openStickerModal() {
    if (!stickerModal) return;
    previousFocusedElement = document.activeElement;
    stickerDraft = [...stickerSaved];
    renderStickerDesigns();
    stickerModal.hidden = false;
    document.body.style.overflow = "hidden";
    stickerModalClose?.focus();
}

function closeStickerModal() {
    if (!stickerModal) return;
    stickerModal.hidden = true;
    document.body.style.overflow = "";
    previousFocusedElement?.focus();
}

function confirmStickerSelection() {
    if (getStickerTotal(stickerDraft) !== getStickerLimit()) return;
    stickerSaved = [...stickerDraft];
    updateStickerSummary();
    closeStickerModal();
}

stickerOpenButton?.addEventListener("click", openStickerModal);
stickerModalClose?.addEventListener("click", closeStickerModal);
stickerModalBackdrop?.addEventListener("click", closeStickerModal);
stickerConfirmButton?.addEventListener("click", confirmStickerSelection);

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && stickerModal && !stickerModal.hidden) {
        closeStickerModal();
    }
});

// 기존 수량 변경 이벤트가 처리된 다음, 스티커 선택 안내도 갱신한다.
if (stickerSetQuantityInput) {
    stickerSetQuantityInput.addEventListener("input", () => {
        updateStickerCount();
        updateStickerSummary();
    });
    stickerSetQuantityInput.addEventListener("change", () => {
        updateStickerCount();
        updateStickerSummary();
    });
}
if (stickerCard) {
    stickerCard.querySelector(".quantity-minus")?.addEventListener("click", () => {
        updateStickerCount();
        updateStickerSummary();
    });
    stickerCard.querySelector(".quantity-plus")?.addEventListener("click", () => {
        updateStickerCount();
        updateStickerSummary();
    });
}

renderStickerDesigns();
updateStickerSummary();
    updateOrderSummary();

});
