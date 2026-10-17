// =====================================================
// GOLDEN BALL
// REGISTER PAGE JAVASCRIPT
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const form =
        document.getElementById("registerForm");

    const message =
        document.getElementById("registerMessage");

    const button =
        document.getElementById("registerButton");


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
            "before register.js."
        );
    }


    // -------------------------------------------------
    // REGISTER FORM
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

        const confirmPassword =
            document.getElementById("confirmPassword")
                .value;


        if (!email || !password || !confirmPassword) {

            message.innerText =
                "Please fill in every field.";

            return;
        }


        if (password.length < 8) {

            message.innerText =
                "Password must be at least 8 characters.";

            return;
        }


        if (password !== confirmPassword) {

            message.innerText =
                "Passwords do not match.";

            return;
        }


        message.innerText =
            "Creating your account...";

        button.disabled = true;

        button.textContent =
            "Creating Account...";


        try {

            /*
             * Matches AuthController.register():
             * @RequestParam String email, @RequestParam String password
             * — form-urlencoded, no name field exists on User.
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
                    "/api/auth/register",
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


            /*
             * AuthController returns UserResponse (JSON) on
             * success, but a plain string via
             * ResponseEntity.badRequest().body(e.getMessage())
             * on failure — NOT JSON. Read as text first, then
             * try to parse as JSON, so both shapes work.
             */

            const raw =
                await response.text();

            let result;

            try {
                result = JSON.parse(raw);
            } catch (parseError) {
                result = { message: raw };
            }


            // -------------------------------------------------
            // REGISTER FAILED
            // -------------------------------------------------

            if (!response.ok) {

                message.innerText =
                    result.message ||
                    "Could not create account. Please try again.";

                button.disabled = false;

                button.textContent =
                    "Create Account";

                return;
            }


            // -------------------------------------------------
            // REGISTER SUCCESSFUL
            // -------------------------------------------------

            console.log(
                "Registration successful:",
                result
            );

            message.innerText =
                "Account created! Redirecting to sign in...";


            setTimeout(function () {

                window.location.href =
                    "login.html";

            }, 800);


        }

        catch (error) {

            console.error(
                "Registration error:",
                error
            );


            message.innerText =
                "Could not connect to the server.";


            button.disabled = false;

            button.textContent =
                "Create Account";

        }

    });

});