const refreshAccessToken = async (): Promise<string | null> => {
    try {
        // Get refresh token from localStorage
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            console.error("No refresh token found");
            return null;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                
            },
            body: JSON.stringify({ refreshToken }),
        });

        const data = await response.json();

        if (response.ok) {
            // Save new access token
            localStorage.setItem("accessToken", data.result.accessToken);
            console.log("Access token refreshed");

            return data.result.accessToken;
        } else {
            console.error("Failed to refresh token:", data.message);
            return null;
        }
    } catch (error) {
        console.error("Error refreshing token:", error);
        return null;
    }
};