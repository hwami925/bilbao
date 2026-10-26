/* ========================================
   BILBAO — OFFICIAL GOODS
   GOODS.JS
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       1. 기본 설정
    ===================================== */

    const SHIPPING_FEE = 3000;

    // 실제 주문 개시 전까지 false 유지
const ORDERS_OPEN = false;

    // 구글 Apps Script 주문 서버
const ORDER_API_URL =
    "https://script.google.com/macros/s/AKfycbytrK8NYdAPTowrhZwKKzW-ml4a6ZXjGpchXydY46XrcImn2MW_osLkcUr0M4o4MChf/exec";


    /* =====================================
       2. 상품 데이터
    ===================================== */

    const products = {

        postcard: {
            name: "일러스트 엽서 8장 세트",
            price: 6000
        },

        photocard: {
            name: "일반 포토카드 5장 세트",
            price: 3000
        },

        clearcard: {
            name: "투명 포토카드 5장 세트",
            price: 3500
        },

        cardtag: {
            name: "캐릭터 카드택",
            price: 1000
        },

        sticker_select: {
            name: "띠부스티커 10장 선택 세트",
            price: 7000
        },

        sticker_full: {
            name: "띠부스티커 30장 풀세트",
            price: 20000
        }

    };


    /* =====================================
       3. HTML 요소
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
       4. 주문 처리 상태
    ===================================== */

    let isSubmitting = false;
    let orderCompleted = false;


    /* =====================================
       5. 수량값 정리
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
       6. 주문 요약 업데이트
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


        // 선택 상품 수량

        if (selectedCountElement) {

            selectedCountElement.textContent =
                `${totalQuantity}개`;

        }


        // 배송비

        const shippingFee =
            totalQuantity > 0 ? SHIPPING_FEE : 0;

        if (shippingPriceElement) {

            shippingPriceElement.textContent =
                `${shippingFee.toLocaleString("ko-KR")}원`;

        }


        // 최종 결제 금액

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
       7. 상품별 이벤트
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


        // 체크박스

        checkbox.addEventListener("change", () => {

            updateOrderSummary();

        });


        // 수량 감소

        minusButton.addEventListener("click", () => {

            const quantity = normalizeQuantity(quantityInput);

            quantityInput.value = Math.max(
                1,
                quantity - 1
            );

            updateOrderSummary();

        });


        // 수량 증가

        plusButton.addEventListener("click", () => {

            const quantity = normalizeQuantity(quantityInput);

            quantityInput.value = Math.min(
                99,
                quantity + 1
            );

            updateOrderSummary();

        });


        // 직접 입력

        quantityInput.addEventListener("input", () => {

            updateOrderSummary();

        });

        quantityInput.addEventListener("change", () => {

            normalizeQuantity(quantityInput);

            updateOrderSummary();

        });

    });


    /* =====================================
       8. 주문자명 → 입금자명 자동 입력
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
       9. 주문 버튼 초기 설정
    ===================================== */

    if (submitButton) {

        submitButton.disabled = !ORDERS_OPEN;

        submitButton.textContent = ORDERS_OPEN
            ? "주문 신청하기"
            : "주문 신청 준비 중";

    }


    /* =====================================
       10. 스티커 30종 데이터
    ===================================== */

    const stickerNames = [

        "하이",
        "주글게",
        "e-w",
        "ㅋㅋㅋ",
        "으엥",

        "런",
        "야르",
        "줴줴이야",
        "잘자",
        "흥이나",

        "무지개반사",
        "내눈을 바라봐",
        "야호",
        "개피곤",
        "아유 그러시겠죠",

        "내마음",
        "거지",
        "선물",
        "아자스",
        "눈치",

        "HELP",
        "가쥬아",
        "쓰담쓰담",
        "오",
        "빌바오",

        "레볼리",
        "리베",
        "케이지",
        "미나",
        "레볼리(전)"

    ];

    const stickerDesigns = stickerNames.map(
        (name, index) => ({
            id: index + 1,
            name: name
        })
    );


    /* =====================================
       11. 스티커 HTML 요소
    ===================================== */

    const stickerOpenButton = document.getElementById(
        "sticker-open-button"
    );

    const stickerModal = document.getElementById(
        "sticker-modal"
    );

    const stickerModalClose = document.getElementById(
        "sticker-modal-close"
    );

    const stickerModalBackdrop = document.getElementById(
        "sticker-modal-backdrop"
    );

    const stickerDesignGrid = document.getElementById(
        "sticker-design-grid"
    );

    const stickerSelectedCount = document.getElementById(
        "sticker-selected-count"
    );

    const stickerConfirmButton = document.getElementById(
        "sticker-confirm-button"
    );

    const stickerSelectionSummary = document.getElementById(
        "sticker-selection-summary"
    );


    /* =====================================
       12. 스티커 세트 수량
    ===================================== */

    const STICKERS_PER_SET = 10;

    const stickerSetCheckbox = document.querySelector(
        '.goods-checkbox[data-product="sticker_select"]'
    );

    const stickerSetCard = stickerSetCheckbox?.closest(
        ".goods-product"
    );

    const stickerSetQuantityInput = stickerSetCard?.querySelector(
        ".quantity-input"
    );

    function getStickerLimit() {

        const setQuantity = stickerSetQuantityInput
            ? normalizeQuantity(stickerSetQuantityInput)
            : 1;

        return setQuantity * STICKERS_PER_SET;

    }


    /* =====================================
       13. 스티커 선택 상태
    ===================================== */

    let stickerDraft = stickerDesigns.map(() => 0);

    let stickerSaved = stickerDesigns.map(() => 0);

    let previousFocusedElement = null;


    /* =====================================
       14. 스티커 수량 계산
    ===================================== */

    function getStickerTotal(quantities) {

        return quantities.reduce(
            (total, quantity) => total + quantity,
            0
        );

    }


    /* =====================================
       15. 스티커 선택 수량 표시
    ===================================== */

    function updateStickerCount() {

        const total = getStickerTotal(stickerDraft);

        const limit = getStickerLimit();

        if (stickerSelectedCount) {

            stickerSelectedCount.textContent = total;

        }

        const countDisplay =
            stickerSelectedCount?.parentElement;

        if (countDisplay) {

            let limitElement = document.getElementById(
                "sticker-selection-limit"
            );

            if (!limitElement) {

                Array.from(countDisplay.childNodes).forEach(
                    node => {

                        if (
                            node.nodeType === Node.TEXT_NODE &&
                            node.textContent.includes("/ 10장")
                        ) {

                            node.textContent = "";

                        }

                    }
                );

                limitElement = document.createElement("span");

                limitElement.id = "sticker-selection-limit";

                countDisplay.appendChild(limitElement);

            }

            limitElement.textContent = ` / ${limit}장`;

        }

        if (stickerConfirmButton) {

            stickerConfirmButton.disabled =
                total !== limit;

        }

    }


    /* =====================================
       16. 스티커 카드 생성
    ===================================== */

    function renderStickerDesigns() {

        if (!stickerDesignGrid) return;

        stickerDesignGrid.innerHTML = "";

        stickerDesigns.forEach((sticker, index) => {

            const card = document.createElement("div");

            card.className = "sticker-design-card";


            // 이미지

            const image = document.createElement("div");

            image.className = "sticker-design-image";

            const stickerImage = document.createElement("img");

stickerImage.src =
    `../images/stickers/${String(sticker.id).padStart(2, "0")}.png`;

            stickerImage.alt = sticker.name;

            stickerImage.loading = "lazy";

            image.appendChild(stickerImage);


            // 이름

            const name = document.createElement("p");

            name.className = "sticker-design-name";

            name.textContent =
                `${String(sticker.id).padStart(2, "0")} · ${sticker.name}`;


            // 수량 조절 영역

            const quantityControls = document.createElement("div");

            quantityControls.className = "sticker-design-quantity";


            // 감소 버튼

            const minusButton = document.createElement("button");

            minusButton.type = "button";

            minusButton.textContent = "−";

            minusButton.setAttribute(
                "aria-label",
                `${sticker.name} 수량 감소`
            );


            // 현재 수량

            const quantityText = document.createElement("span");

            quantityText.textContent = stickerDraft[index];


            // 증가 버튼

            const plusButton = document.createElement("button");

            plusButton.type = "button";

            plusButton.textContent = "+";

            plusButton.setAttribute(
                "aria-label",
                `${sticker.name} 수량 증가`
            );


            // 선택 상태 업데이트

            function updateCardSelection() {

                const quantity = stickerDraft[index];

                quantityText.textContent = quantity;

                card.classList.toggle(
                    "is-selected",
                    quantity > 0
                );

            }


            // 수량 감소

            minusButton.addEventListener("click", () => {

                if (stickerDraft[index] <= 0) return;

                stickerDraft[index]--;

                updateCardSelection();

                updateStickerCount();

            });


            // 수량 증가

            plusButton.addEventListener("click", () => {

                if (
                    getStickerTotal(stickerDraft) >=
                    getStickerLimit()
                ) {
                    return;
                }

                stickerDraft[index]++;

                updateCardSelection();

                updateStickerCount();

            });


            quantityControls.append(
                minusButton,
                quantityText,
                plusButton
            );

            card.append(
                image,
                name,
                quantityControls
            );

            stickerDesignGrid.appendChild(card);

            updateCardSelection();

        });

        updateStickerCount();

    }


    /* =====================================
       17. 스티커 선택 요약
    ===================================== */

    function updateStickerSummary() {

        if (!stickerSelectionSummary) return;

        const total = getStickerTotal(stickerSaved);

        const limit = getStickerLimit();

        if (total === 0) {

            stickerSelectionSummary.textContent =
                "아직 선택한 디자인이 없습니다.";

            return;

        }

        const selected = stickerSaved
            .map((quantity, index) => ({
                name: stickerDesigns[index].name,
                quantity: quantity
            }))
            .filter(item => item.quantity > 0);

        const selectedText = selected
            .map(item => `${item.name} × ${item.quantity}`)
            .join(", ");

        if (total !== limit) {

            stickerSelectionSummary.textContent =
                `선택 수량을 다시 맞춰주세요. (${total}/${limit}장) · ${selectedText}`;

        } else {

            stickerSelectionSummary.textContent =
                `선택 완료 (${total}장) · ${selectedText}`;

        }

    }


    /* =====================================
       18. 스티커 팝업 열기
    ===================================== */

    function openStickerModal() {

        if (!stickerModal) return;

        previousFocusedElement = document.activeElement;

        stickerDraft = [...stickerSaved];

        renderStickerDesigns();

        stickerModal.hidden = false;

        document.body.style.overflow = "hidden";

        stickerModalClose?.focus();

    }


    /* =====================================
       19. 스티커 팝업 닫기
    ===================================== */

    function closeStickerModal() {

        if (!stickerModal) return;

        stickerModal.hidden = true;

        document.body.style.overflow = "";

        previousFocusedElement?.focus();

    }


    /* =====================================
       20. 스티커 선택 저장
    ===================================== */

    function confirmStickerSelection() {

        if (
            getStickerTotal(stickerDraft) !==
            getStickerLimit()
        ) {
            return;
        }

        stickerSaved = [...stickerDraft];

        updateStickerSummary();

        closeStickerModal();

    }


    /* =====================================
       21. 스티커 버튼 이벤트
    ===================================== */

    stickerOpenButton?.addEventListener(
        "click",
        openStickerModal
    );

    stickerModalClose?.addEventListener(
        "click",
        closeStickerModal
    );

    stickerModalBackdrop?.addEventListener(
        "click",
        closeStickerModal
    );

    stickerConfirmButton?.addEventListener(
        "click",
        confirmStickerSelection
    );


    /* =====================================
       22. ESC 키로 팝업 닫기
    ===================================== */

    document.addEventListener("keydown", event => {

        if (!stickerModal || stickerModal.hidden) return;

        if (event.key === "Escape") {

            closeStickerModal();

        }

    });


    /* =====================================
       23. 스티커 세트 수량 변경 감지
    ===================================== */

    if (stickerSetCard) {

        stickerSetCard.addEventListener("click", () => {

            setTimeout(() => {

                updateStickerCount();

                updateStickerSummary();

            }, 0);

        });

    }

    if (stickerSetQuantityInput) {

        stickerSetQuantityInput.addEventListener(
            "input",
            () => {

                updateStickerCount();

                updateStickerSummary();

            }
        );

        stickerSetQuantityInput.addEventListener(
            "change",
            () => {

                updateStickerCount();

                updateStickerSummary();

            }
        );

    }


    /* =====================================
       24. 주문 데이터 생성
    ===================================== */

    function createOrderData() {

        const items = [];

        productCards.forEach(card => {

            const checkbox = card.querySelector(
                ".goods-checkbox"
            );

            const quantityInput = card.querySelector(
                ".quantity-input"
            );

            if (
                !checkbox ||
                !quantityInput ||
                !checkbox.checked
            ) {
                return;
            }

            items.push({

                id: checkbox.dataset.product,

                quantity: normalizeQuantity(quantityInput)

            });

        });


        // 스티커 선택 정보

        const stickers = stickerSaved
            .map((quantity, index) => ({

                id: index + 1,

                quantity: quantity

            }))
            .filter(item => item.quantity > 0);


        return {

            name:
                document.getElementById("order-name")?.value.trim() || "",

            depositor:
                document.getElementById("order-depositor")?.value.trim() || "",

            contact:
                document.getElementById("order-contact")?.value.trim() || "",

            address:
                document.getElementById("order-address")?.value.trim() || "",

            request:
                document.getElementById("order-request")?.value.trim() || "",

            privacy:
                document.getElementById("order-privacy")?.checked === true,

            items: items,

            stickers: items.some(
                item => item.id === "sticker_select"
            )
                ? stickers
                : []

        };

    }


    /* =====================================
       25. 주문 데이터 검증
    ===================================== */

    function validateOrderData(data) {

        if (
            !data.name ||
            !data.depositor ||
            !data.contact ||
            !data.address
        ) {

            throw new Error(
                "필수 주문 정보를 입력해 주세요."
            );

        }

        if (!data.privacy) {

            throw new Error(
                "개인정보 수집에 동의해 주세요."
            );

        }

        if (data.items.length === 0) {

            throw new Error(
                "주문할 상품을 선택해 주세요."
            );

        }

        const stickerSet = data.items.find(
            item => item.id === "sticker_select"
        );

        if (stickerSet) {

            const selectedCount = data.stickers.reduce(
                (sum, item) => sum + item.quantity,
                0
            );

            if (
                selectedCount !==
                stickerSet.quantity * 10
            ) {

                throw new Error(
                    "띠부스티커 선택 수량을 확인해 주세요."
                );

            }

        }

    }


    /* =====================================
       26. 서버로 주문 전송
    ===================================== */

    async function sendOrderToServer(data) {

        const response = await fetch(ORDER_API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },

            body: JSON.stringify(data),

            redirect: "follow"

        });

        if (!response.ok) {

            throw new Error(
                "주문 서버 연결에 실패했습니다."
            );

        }

        const result = await response.json();

        if (!result.success) {

            throw new Error(
                result.message || "주문 처리에 실패했습니다."
            );

        }

        return result;

    }


    /* =====================================
       27. 주문 완료 화면 표시
    ===================================== */

    function showOrderComplete(orderId, total) {

        const orderIdElement = document.getElementById(
            "complete-order-id"
        );

        const totalElement = document.getElementById(
            "complete-order-total"
        );

        const orderSection = document.querySelector(
            ".goods-order-section"
        );

        const goodsWorktable = document.querySelector(
            ".goods-worktable"
        );

        const completeSection = document.getElementById(
            "order-complete"
        );

        if (
            !orderIdElement ||
            !totalElement ||
            !completeSection
        ) {

            throw new Error(
                "주문 완료 화면 요소를 찾을 수 없습니다."
            );

        }

        orderIdElement.textContent = orderId;

        totalElement.textContent =
            `${Number(total).toLocaleString("ko-KR")}원`;

        if (orderSection) {

            orderSection.hidden = true;

        }

        if (goodsWorktable) {

            goodsWorktable.hidden = true;

        }

        completeSection.hidden = false;

        completeSection.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }


    /* =====================================
       28. 주문 제출 이벤트
       중복 제출 방지
    ===================================== */

    if (orderForm) {

        orderForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                // 중복 제출 차단

                if (
                    isSubmitting ||
                    orderCompleted
                ) {
                    return;
                }


                // 공개 주문 접수 차단

                if (!ORDERS_OPEN) {

                    alert(
                        "현재는 주문 접수를 준비 중입니다."
                    );

                    return;

                }


                try {

                    const orderData = createOrderData();

                    validateOrderData(orderData);


                    // 전송 중 상태

                    isSubmitting = true;

                    if (submitButton) {

                        submitButton.disabled = true;

                        submitButton.textContent =
                            "주문 처리 중...";

                    }


                    // 서버 전송

                    const result =
                        await sendOrderToServer(orderData);


                    // 서버에서 성공 응답을 받으면 완료 처리

                    orderCompleted = true;


                    // 주문 완료 화면 표시

                    showOrderComplete(
                        result.orderId,
                        result.total
                    );


                } catch (error) {

                    console.error(
                        "BILBAO 주문 오류:",
                        error
                    );

                    alert(error.message);


                } finally {

                    isSubmitting = false;


                    // 완료된 주문은 다시 제출할 수 없음

                    if (submitButton) {

                        if (orderCompleted) {

                            submitButton.disabled = true;

                            submitButton.textContent =
                                "주문 신청 완료";

                        } else {

                            submitButton.disabled =
                                !ORDERS_OPEN;

                            submitButton.textContent =
                                ORDERS_OPEN
                                    ? "주문 신청하기"
                                    : "주문 신청 준비 중";

                        }

                    }

                }

            }
        );

    }


    /* =====================================
       29. 초기 실행
    ===================================== */

    renderStickerDesigns();

    updateStickerSummary();

    updateOrderSummary();


    /* =====================================
       30. 개발자용 주문 데이터 테스트
       서버 전송 없음
    ===================================== */

    window.testBilbaoOrder = function () {

        try {

            const orderData = createOrderData();

            validateOrderData(orderData);

            console.log(
                "BILBAO 주문 데이터 테스트"
            );

            console.log(orderData);

            alert(
                "주문 데이터 생성 성공! F12 콘솔을 확인해 주세요."
            );

        } catch (error) {

            console.error(error.message);

            alert(error.message);

        }

    };


    /* =====================================
       31. 서버 연결 테스트
       개인정보 전송 없음
       주문 저장 없음
    ===================================== */

    window.testBilbaoServer = async function () {

        try {

            console.log(
                "빌바오 서버 POST 연결 테스트 시작"
            );

            const response = await fetch(
                ORDER_API_URL,
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify({
                        test: true
                    }),

                    redirect: "follow"

                }
            );

            const result = await response.json();

            console.log(
                "서버 응답:",
                result
            );

            alert(
                "서버 응답 확인! F12 콘솔을 봐줘."
            );

        } catch (error) {

            console.error(
                "서버 연결 테스트 오류:",
                error
            );

            alert(
                "브라우저에서 응답을 읽지 못했어. F12 콘솔을 확인해 줘."
            );

        }

    };


    /* =====================================
       32. 주문 완료 화면 미리보기
       실제 주문 전송 없음
    ===================================== */

    window.previewBilbaoOrder = function () {

        showOrderComplete(
            "BILBAO-TEST-001",
            16000
        );

        console.log(
            "BILBAO 주문 완료 화면 미리보기 실행!"
        );

    };


    /* =====================================
       33. 초기화 완료
    ===================================== */

    console.log(
        "BILBAO GOODS.JS 로딩 완료"
    );

});
