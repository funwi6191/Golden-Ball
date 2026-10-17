// =====================================================
// GOLDEN BALL
// HOME PAGE JAVASCRIPT
// =====================================================

// =====================================================
// PAGE INITIALIZATION
// =====================================================
document.addEventListener("DOMContentLoaded", function () {
    console.log("Golden Ball Home Page loaded successfully.");
    setCurrentYear();
    if (typeof updateNavigation === "function") {
        updateNavigation();
    } else {
        console.warn(
            "updateNavigation() is not defined — " +
            "check that auth.js loaded successfully " +
            "before index.js."
        );
    }
    loadVotingStatus();
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

// =====================================================
// VOTING STATUS
// =====================================================
async function loadVotingStatus() {
    const statusElement =
        document.getElementById("votingStatus");
    const messageElement =
        document.getElementById("votingStatusMessage");
    const awardElement =
        document.getElementById("awardName");
    try {
        /*
         * Your backend already has:
         *
         * GET /api/voting-window
         *
         */
        const response =
            await fetch("/api/voting-window");
        if (!response.ok) {
            throw new Error(
                "Unable to load voting status."
            );
        }
        const votingWindow =
            await response.json();
        if (!votingWindow) {
            statusElement.textContent =
                "Voting Status Unavailable";
            messageElement.textContent =
                "Please check back later.";
            return;
        }
        // -------------------------------------------------
        // GET CURRENT TIME
        // -------------------------------------------------
        const now =
            new Date();
        const start =
            new Date(votingWindow.startAt);
        const end =
            new Date(votingWindow.endAt);
        // -------------------------------------------------
        // VOTING IS OPEN
        // -------------------------------------------------
        if (now >= start && now <= end) {
            statusElement.textContent =
                "Voting is Open";
            messageElement.textContent =
                "Make your voice count.";
        }
        // -------------------------------------------------
        // VOTING HAS NOT STARTED
        // -------------------------------------------------
        else if (now < start) {
            statusElement.textContent =
                "Voting has not started";
            messageElement.textContent =
                "Voting will open soon.";
        }
        // -------------------------------------------------
        // VOTING HAS ENDED
        // -------------------------------------------------
        else {
            statusElement.textContent =
                "Voting is Closed";
            messageElement.textContent =
                "The voting period has ended.";
        }
        // -------------------------------------------------
        // AWARD NAME
        // -------------------------------------------------
        if (awardElement) {
            awardElement.textContent =
                "Golden Ball " +
                new Date().getFullYear();
        }
    } catch (error) {
        console.error(
            "Voting status error:",
            error
        );
        statusElement.textContent =
            "Voting Status Unavailable";
        messageElement.textContent =
            "Please check back later.";
    }
}
