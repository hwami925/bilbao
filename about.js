/* ========================================
   BILBAO — ABOUT PAGE
   SCROLL ANIMATION
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    const sections = document.querySelectorAll(".about-section");

    // 스크롤에 따라 문서 등장
    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver((entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }

            });

        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -30px 0px"
        });

        sections.forEach((section) => {
            observer.observe(section);
        });

    } else {

        // 구형 브라우저 대응
        sections.forEach((section) => {
            section.classList.add("visible");
        });

    }

});
