// =====================================================
// GOLDEN BALL
// LEADERBOARD PAGE JAVASCRIPT
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Golden Ball Leaderboard page loaded.");

    setCurrentYear();

    if (typeof updateNavigation === "function") {
        updateNavigation();
    } else {
        console.warn(
            "updateNavigation() is not defined — " +
            "check that auth.js loaded successfully " +
            "before leaderboard.js."
        );
    }

    loadLeaderboard();

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
// LOAD LEADERBOARD
// =====================================================

async function loadLeaderboard() {

    const container =
        document.getElementById("leaderboardList");

    const message =
        document.getElementById("leaderboardMessage");


    try {

        const response =
            await fetch("/api/candidates");


        if (!response.ok) {

            throw new Error(
                "Could not load leaderboard."
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
                        No candidates yet
                    </h3>

                    <p>
                        The leaderboard will populate once
                        candidates have been added.
                    </p>

                </div>

            `;

            return;

        }


        // -------------------------------------------------
        // RANK CANDIDATES
        // -------------------------------------------------

        /*
         * TODO: this currently ranks purely by statsScore.
         *
         * The Golden Ball formula is:
         *
         *   finalScore = (fanVoteShare * 0.30)
         *              + (statsScore   * 0.70)
         *
         * Once there's an endpoint that returns each
         * candidate's fan vote share (e.g. GET /api/votes/counts
         * or a voteCount field on Candidate), swap the
         * sort/display below to use the blended finalScore
         * instead of statsScore alone.
         */

        const ranked = candidates
            .slice()
            .sort((a, b) =>
                (b.statsScore ?? -1) - (a.statsScore ?? -1)
            )
            .slice(0, 30);


        // -------------------------------------------------
        // RENDER
        // -------------------------------------------------

        ranked.forEach((candidate, index) => {

            const row =
                document.createElement("div");


            row.className =
                "leaderboard-row";


            row.innerHTML = `

                <div class="leaderboard-rank">
                    ${index + 1}
                </div>


                <div class="leaderboard-avatar">
                    ⚽
                </div>


                <div class="leaderboard-info">

                    <h3>
                        ${candidate.name}
                    </h3>

                    <p>
                        ${candidate.club || "N/A"}
                        &middot;
                        ${candidate.country || "N/A"}
                    </p>

                </div>


                <div class="leaderboard-score">

                    <div class="leaderboard-score-label">
                        Score
                    </div>

                    <div class="leaderboard-score-value">
                        ${
                            candidate.statsScore != null
                                ? candidate.statsScore.toFixed(2)
                                : "N/A"
                        }
                    </div>

                </div>

            `;


            container.appendChild(row);

        });


        message.innerText = "";

    }

    catch (error) {

        console.error(
            "Leaderboard loading error:",
            error
        );


        container.innerHTML = `

            <div class="candidate-error">

                <strong>
                    Unable to load leaderboard
                </strong>

                Please make sure the server
                is running and try again.

            </div>

        `;


        message.innerText =
            "Could not connect to the server.";

    }

}
