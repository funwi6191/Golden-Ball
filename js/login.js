// =====================================================
// GOLDEN BALL
// LOGIN PAGE JAVASCRIPT
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const form =
        document.getElementById("loginForm");

    const message =
        document.getElementById("loginMessage");

    const button =
        document.getElementById("loginButton");


    // -------------------------------------------------
    // CURRENT YEAR
    // -------------------------------------------------

    const year =
        document.getElementById("currentYear");

    if (year) {
        year.textContent =
            new Date().getFullYear();
    }


    // -------------------------------------------------
    // NAV STATE
    // -------------------------------------------------

    if (typeof updateNavigation === "function") {
        updateNavigation();
    } else {
        console.warn(
            "updateNavigation() is not defined — " +
            "check that auth.js loaded successfully " +
            "before login.js."
        );
    }


    // -------------------------------------------------
    // LOGIN FORM
    // -------------------------------------------------

    form.addEventListener("submit", async function (event) {

        event.preventDefault();


        const email =
            document.getElementById("email")
                .value
                .trim();

        const password =
            document.getElementById("password")
                .value;


        if (!email || !password) {

            message.innerText =
                "Please enter your email and password.";

            return;
        }


        message.innerText =
            "Signing in...";

        button.disabled = true;

        button.textContent =
            "Signing In...";


        try {

            /*
             * Your Spring Boot login endpoint
             * expects email and password as
             * request parameters.
             */

            const formData =
                new URLSearchParams();

            formData.append(
                "email",
                email
            );

            formData.append(
                "password",
                password
            );


            const response =
                await fetch(
                    "/api/auth/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/x-www-form-urlencoded"
                        },

                        body:
                            formData.toString()
                    }
                );


            const raw =
                await response.text();

            let result;

            try {
                result = JSON.parse(raw);
            } catch (parseError) {
                result = { message: raw };
            }


            // -------------------------------------------------
            // LOGIN FAILED
            // -------------------------------------------------

            if (!response.ok) {

                message.innerText =
                    result.message ||
                    "Login failed. Please check your details.";

                button.disabled = false;

                button.textContent =
                    "Sign In";

                return;
            }


            // -------------------------------------------------
            // LOGIN SUCCESSFUL
            // -------------------------------------------------

            /*
             * IMPORTANT:
             *
             * Confirm your AuthController returns
             * a JWT token (e.g. { token: "..." }).
             * If it still returns UserResponse only,
             * result.token will be undefined and this
             * will store the string "undefined" as the
             * token, which reads as logged-in even though
             * it isn't. Fix the backend response shape
             * before relying on this.
             */

            console.log(
                "Login successful:",
                result
            );


            if (!result.token) {

                console.warn(
                    "Login response has no token field. " +
                    "Nav state and voting will behave as if " +
                    "logged out until the backend returns a token."
                );

                message.innerText =
                    "Login succeeded, but no token was returned. " +
                    "Contact support.";

                button.disabled = false;

                button.textContent =
                    "Sign In";

                return;
            }


            // Save JWT

            localStorage.setItem(
                "jwtToken",
                result.token
            );


            message.innerText =
                "Login successful!";


            setTimeout(function () {

                window.location.href =
                    "candidates.html";

            }, 800);


        }

        catch (error) {

            console.error(
                "Login error:",
                error
            );


            message.innerText =
                "Could not connect to the server.";


            button.disabled = false;

            button.textContent =
                "Sign In";

        }

    });

});