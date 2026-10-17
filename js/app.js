const API_BASE = "/api";


// =============================
// PAGE NAVIGATION
// =============================

function showSection(sectionName) {

    document.querySelectorAll(".page-section")
        .forEach(section => {
            section.style.display = "none";
        });

    const section =
        document.getElementById(sectionName);

    if (section) {
        section.style.display = "block";
    }

    if (sectionName === "candidates") {
        loadCandidates();
    }

}


// =============================
// CANDIDATES
// =============================

let allCandidates = [];


async function loadCandidates() {

    const container =
        document.getElementById("candidateList");

    const message =
        document.getElementById("candidateMessage");

    if (!container) {
        return;
    }

    container.innerHTML =
        '<div class="loading">Loading candidates...</div>';

    try {

        const response =
            await fetch(API_BASE + "/candidates");

        if (!response.ok) {

            throw new Error(
                "Could not load candidates"
            );

        }

        allCandidates =
            await response.json();

        const count =
            document.getElementById(
                "candidateCount"
            );

        if (count) {
            count.innerText =
                allCandidates.length;
        }

        displayCandidates(allCandidates);

        if (message) {
            message.innerText = "";
        }

    } catch (error) {

        console.error(error);

        container.innerHTML =
            '<div class="loading">Unable to load candidates.</div>';

        if (message) {
            message.innerText =
                "Could not connect to the server.";
        }
    }
}


// =============================
// DISPLAY CANDIDATES
// =============================

function displayCandidates(candidates) {

    const container =
        document.getElementById("candidateList");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (candidates.length === 0) {

        container.innerHTML =
            '<div class="loading">No players found.</div>';

        return;
    }


    candidates.forEach(candidate => {

        const card =
            document.createElement("div");

        card.className =
            "player-card";


        card.innerHTML = `

            <div class="player-image">
                ⚽
            </div>

            <div class="player-info">

                <h3>
                    ${candidate.name}
                </h3>

                <div class="player-meta">

                    ${candidate.club || "Club not available"}
                    <br>

                    ${candidate.country || "Country not available"}
                    <br>

                    ${candidate.position || "Position not available"}

                </div>

                <div class="stats-box">

                    <span class="stats-label">
                        PERFORMANCE SCORE
                    </span>

                    <span class="stats-value">

                        ${
                            candidate.statsScore ??
                            "—"
                        }

                    </span>

                </div>

                <button
                    class="vote-player-btn"
                    onclick="voteForCandidate(${candidate.id})">

                    VOTE FOR
                    ${candidate.name}

                </button>

            </div>
        `;

        container.appendChild(card);

    });
}


// =============================
// SEARCH
// =============================

function filterCandidates() {

    const searchInput =
        document.getElementById(
            "candidateSearch"
        );

    if (!searchInput) {
        return;
    }

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const filtered =
        allCandidates.filter(candidate => {

            return (

                candidate.name
                    ?.toLowerCase()
                    .includes(search)

                ||

                candidate.club
                    ?.toLowerCase()
                    .includes(search)

                ||

                candidate.country
                    ?.toLowerCase()
                    .includes(search)

            );

        });


    displayCandidates(filtered);
}


// =============================
// VOTING
// =============================

async function voteForCandidate(candidateId) {

    const message =
        document.getElementById(
            "candidateMessage"
        );

    const token =
        localStorage.getItem("jwtToken");


    // User isn't logged in
    if (!token) {

        if (message) {

            message.innerText =
                "Please login before voting.";

        }

        showSection("login");

        return;
    }


    if (message) {
        message.innerText =
            "Submitting vote...";
    }


    try {

        const response =
            await fetch(
                API_BASE + "/votes?candidateId=" + candidateId,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        const result =
            await response.text();


        if (!response.ok) {

            if (message) {
                message.innerText =
                    result || "Vote failed.";
            }

            return;
        }


        if (message) {

            message.innerText =
                "✓ Vote submitted successfully!";

        }


        // Refresh leaderboard if it exists
        if (
            typeof loadLeaderboard ===
            "function"
        ) {
            loadLeaderboard();
        }


    } catch (error) {

        console.error(error);

        if (message) {

            message.innerText =
                "Could not connect to the server.";

        }
    }
}


// =============================
// STARTUP
// =============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Golden Ball application loaded."
        );

    }
);