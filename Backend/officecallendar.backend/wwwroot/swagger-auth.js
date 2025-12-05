(function () {
    const original = window.fetch;

    window.fetch = async (input, init) => {
        const response = await original(input, init);

        if ((input.toString().includes("/login") || input.toString().includes("/register")) && response.ok) {
            const data = await response.clone().json();
            const token = data.token;

            if (token && window.ui) {
                window.ui.preauthorizeApiKey("Bearer", token);
            }
        }

        return response;
    };
})();
