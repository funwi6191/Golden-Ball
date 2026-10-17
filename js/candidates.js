// =====================================================
// GOLDEN BALL
// CANDIDATES PAGE JAVASCRIPT
// =====================================================


// =====================================================
// PAGE INITIALIZATION
// =====================================================
const API_BASE = "/api";

document.addEventListener("DOMContentLoaded", function () {

    console.log("Golden Ball Candidates page loaded.");

    setCurrentYear();

    if (typeof updateNavigation === "function") {
        updateNavigation();
    } else {
        console.warn(
            "updateNavigation() is not defined — " +
            "check that auth.js loaded successfully " +
            "before candidates.js."
        );
    }

    loadVotingStatus();

    loadCandidates();

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
        document.getElementById("votingMessage");


    try {

        const response =
            await fetch("/api/voting-window");


        if (!response.ok) {

            throw new Error(
                "Could not load voting status."
            );

        }


        const votingWindow =
            await response.json();


        const now =
            new Date();

        const start =
            new Date(votingWindow.startAt);

        const end =
            new Date(votingWindow.endAt);


        if (now >= start && now <= end) {

            statusElement.textContent =
                "Voting is Open";

            messageElement.textContent =
                "Make your voice count.";

        }

        else if (now < start) {

            statusElement.textContent =
                "Voting has not started";

            messageElement.textContent =
                "Voting will open soon.";

        }

        else {

            statusElement.textContent =
                "Voting is Closed";

            messageElement.textContent =
                "The voting period has ended.";

        }

    }

    catch (error) {

        console.error(error);

        statusElement.textContent =
            "Voting Status Unavailable";

        messageElement.textContent =
            "Please check back later.";

    }

}


// =====================================================
// LOAD CANDIDATES
// =====================================================

async function loadCandidates() {

    const container =
        document.getElementById("candidateList");

    const message =
        document.getElementById("candidateMessage");


    try {

        const response =
            await fetch("/api/candidates");


        if (!response.ok) {

            throw new Error(
                "Could not load candidates."
            );

        }


        const candidates =
            await response.json();


        container.innerHTML = "";


        // -------------------------------------------------
        // NO CANDIDATES
        // -------------------------------------------------

        if (!candidates || candidates.length === 0) {

            container.innerHTML = `

                <div class="candidate-empty">

                    <div class="candidate-empty-icon">
                        ⚽
                    </div>

                    <h3>
                        No candidates available
                    </h3>

                    <p>
                        The Golden Ball candidates
                        have not been added yet.
                    </p>

                </div>

            `;

            return;

        }


        // -------------------------------------------------
        // DISPLAY CANDIDATES
        // -------------------------------------------------

        candidates.forEach((candidate, index) => {

            const card =
                document.createElement("article");


            card.className =
                "candidate-card";


            card.innerHTML = `

                <div class="candidate-number">
                    ${String(index + 1).padStart(2, "0")}
                </div>


                <div class="candidate-avatar">
                    ⚽
                </div>


                <h3>
                    ${candidate.name}
                </h3>


                <div class="candidate-info">


                    <div class="candidate-info-row">

                        <span>
                            Club
                        </span>

                        <span>
                            ${candidate.club || "N/A"}
                        </span>

                    </div>


                    <div class="candidate-info-row">

                        <span>
                            Country
                        </span>

                        <span>
                            ${candidate.country || "N/A"}
                        </span>

                    </div>


                    <div class="candidate-info-row">

                        <span>
                            Position
                        </span>

                        <span>
                            ${candidate.position || "N/A"}
                        </span>

                    </div>


                </div>


                <div class="candidate-score">

                    <div class="candidate-score-label">
                        Stats Score
                    </div>

                    <div class="candidate-score-value">

                        ${
                            candidate.statsScore ??
                            "N/A"
                        }

                    </div>

                </div>


                <button
                    class="candidate-vote-button"
                    onclick="voteForCandidate(${candidate.id})">

                    Vote for ${candidate.name}

                </button>

            `;


            container.appendChild(card);

        });


        message.innerText = "";

    }

    catch (error) {

        console.error(
            "Candidate loading error:",
            error
        );


        container.innerHTML = `

            <div class="candidate-error">

                <strong>
                    Unable to load candidates
                </strong>

                Please make sure the server
                is running and try again.

            </div>

        `;


        message.innerText =
            "Could not connect to the server.";

    }

}


// =====================================================
// VOTE
// =====================================================

async function voteForCandidate(candidateId) {

    const message =
        document.getElementById("candidateMessage");

    message.innerText =
        "Submitting your vote...";


    try {

        const token =
            localStorage.getItem("jwtToken");


        // ---------------------------------------------
        // CHECK LOGIN
        // ---------------------------------------------

        if (!token) {

            message.innerText =
                "Please log in before voting.";

            return;
        }


        // ---------------------------------------------
        // SEND VOTE
        // ---------------------------------------------

        const response =
            await fetch(
                API_BASE +
                "/votes?candidateId=" +
                encodeURIComponent(candidateId),
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


        // ---------------------------------------------
        // ERROR
        // ---------------------------------------------

        if (!response.ok) {

            console.error(
                "Vote failed:",
                response.status,
                result
            );

            message.innerText =
                result || "Vote failed.";

            return;
        }


        // ---------------------------------------------
        // SUCCESS
        // ---------------------------------------------

        message.innerText =
            "Vote submitted successfully!";

        console.log(
            "Vote successful:",
            result
        );


        // Refresh leaderboard

        if (typeof loadLeaderboard === "function") {
            loadLeaderboard();
        }

    }

    catch (error) {

        console.error(
            "Vote error:",
            error
        );

        message.innerText =
            "Could not connect to the server.";
    }

}