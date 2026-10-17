// =====================================================
// GOLDEN BALL
// ABOUT PAGE JAVASCRIPT
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Golden Ball About page loaded.");

    setCurrentYear();

    if (typeof updateNavigation === "function") {
        updateNavigation();
    } else {
        console.warn(
            "updateNavigation() is not defined — " +
            "check that auth.js loaded successfully " +
            "before about.js."
        );
    }

});


// =====================================================
// CURRENT YEAR
// =====================================================

function setCurrentYear() {

    const yearElement =
        document.getElementById("currentYear");

    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();

    }

}
