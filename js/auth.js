// =====================================================
// GOLDEN BALL
// SHARED AUTH NAVIGATION SCRIPT
// Include this on every page BEFORE the page's own
// script (index.js / candidates.js / etc.), and call
// updateNavigation() from that page's DOMContentLoaded
// handler.
// =====================================================

function updateNavigation() {

    const token = localStorage.getItem("jwtToken");

    const loginNav = document.getElementById("loginNav");
    const userNav = document.getElementById("userNav");
    const logoutButton = document.getElementById("logoutButton");

    console.log("JWT token exists:", !!token);

    if (token) {

        // User is logged in

        if (loginNav) {
            loginNav.style.display = "none";
        }

        if (userNav) {
            userNav.style.display = "inline-block";
        }

        if (logoutButton) {
            logoutButton.style.display = "inline-block";
        }

    } else {

        // User is not logged in

        if (loginNav) {
            loginNav.style.display = "inline-block";
        }

        if (userNav) {
            userNav.style.display = "none";
        }

        if (logoutButton) {
            logoutButton.style.display = "none";
        }
    }
}


function logout() {

    console.log("Logging out...");

    localStorage.removeItem("jwtToken");

    window.location.href = "index.html";
}


// =====================================================
// MOBILE NAV — HAMBURGER MENU
// Auto-initializes on every page that loads this file,
// so no page-specific script needs to call it.
// =====================================================

function initMobileNav() {

    const toggle =
        document.getElementById("navToggle");

    const links =
        document.querySelector(".nav-links");

    if (!toggle || !links) {
        return;
    }

    toggle.addEventListener("click", function () {

        const isOpen =
            links.classList.toggle("open");

        toggle.classList.toggle("open", isOpen);

        toggle.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

    });

    // Close the menu whenever a link/button inside it is clicked

    links
        .querySelectorAll("a, button")
        .forEach(function (el) {

            el.addEventListener("click", function () {

                links.classList.remove("open");

                toggle.classList.remove("open");

                toggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

}

document.addEventListener("DOMContentLoaded", initMobileNav);