const GAS_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;

export const api = {
    getQuestions: async (count = 5) => {
        // If no URL is set (dev mode without backend), return mock
        if (!GAS_URL || GAS_URL.includes("YOUR_SCRIPT_ID")) {
            console.warn("Using Mock Data");
            const response = await fetch('/mock-questions.json');
            const data = await response.json();
            return data.slice(0, count);
        }

        try {
            const response = await fetch(`${GAS_URL}?action=getQuestions&count=${count}`);
            const json = await response.json();
            if (json.status === 'success') {
                return json.data;
            }
            throw new Error(json.message);
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    },

    submitResult: async (data) => {
        // data: { userId, answers: [{id, answer}], passThreshold }
        if (!GAS_URL || GAS_URL.includes("YOUR_SCRIPT_ID")) {
            console.warn("Mock Submit");
            return {
                status: 'success',
                score: 80,
                correctCount: data.answers.length - 1, // Mock
                isPass: true
            };
        }

        try {
            // GAS requires text/plain for POST to avoid OPTIONS/CORS preflight issues in some cases,
            // but standard fetch with distinct mode 'cors' usually works if GAS web app is set to "Anyone"
            // However, the reliable way for GAS POST from client is often sendBeacon or 
            // POST with "Content-Type": "text/plain;charset=utf-8" and data as stringified JSON.

            const response = await fetch(GAS_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'submitResult', ...data }),
                // Google Apps Script doesn't support standard CORS preflight well with 'application/json'
                // 'no-cors' mode makes response opaque (cant read it).
                // The standard workaround is using Content-Type text/plain so it's a simple request.
                headers: {
                    "Content-Type": "text/plain;charset=utf-8",
                },
            });

            const json = await response.json();
            return json;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }
};
