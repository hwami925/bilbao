/* ========================================
   BILBAO — OFFICIAL GOODS
   GOODS.JS
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       1. 상품 데이터
       가격은 확정 후 입력
    ===================================== */
   
const SHIPPING_FEE = 3000;
   
   /* 구글 스프레드시트 주문 접수 서버 */
const ORDER_API_URL =
    "https://script.google.com/macros/s/AKfycbzNTSdLCMtzub2A8IqjFzm3wZeNF-ysrsoyN42TkJHwZSw2_u4fXsVjyLHfr03fYNkR/exec";
   
    const products = {
        postcard: {
            name: "일러스트 엽서",
            price: null
        },

        sticker: {
            name: "캐릭터 씰스티커",
            price: null
        },

        photocard: {
            name: "빌바오 포토카드",
            price: null
        },

        clearcard: {
            name: "투명 포토카드",
            price: null
        },

        cardtag: {
            name: "캐릭터 카드택",
            price: null
        },

        poster: {
            name: "일러스트 포스터",
            price: null
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

    updateOrderSummary();

});
