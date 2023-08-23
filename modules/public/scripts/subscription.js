document.addEventListener("DOMContentLoaded", () => {
    const subscribeButton = document.getElementById("subscribeBtn");

    subscribeButton.addEventListener("click", async () => {
        try {
            const response = await fetch("/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // You can pass any required data here, e.g., email
                body: JSON.stringify({}),
            });

            const data = await response.json();

            if (data.sessionId) {
                console.log("Session ID:", data.sessionId);

                // Redirect to Stripe checkout page
                window.location.href = `https://checkout.stripe.com/checkout.js?sessionId=${data.sessionId}`;
            } else {
                alert("Error creating checkout session. Please try again later.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
});
