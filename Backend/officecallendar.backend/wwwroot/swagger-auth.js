(function () {
    const original = window.fetch;

    window.fetch = async (input, init) => {
        init = init || {};

        // Attach token from localStorage (if present) to every outgoing request
        const storedToken = localStorage.getItem('swagger_jwt_token');
        if (storedToken) {
            if (!init.headers) init.headers = {};

            try {
                if (init.headers instanceof Headers) {
                    init.headers.set('Authorization', 'Bearer ' + storedToken);
                } else if (Array.isArray(init.headers)) {
                    init.headers.push(['Authorization', 'Bearer ' + storedToken]);
                } else {
                    init.headers['Authorization'] = 'Bearer ' + storedToken;
                }
            } catch (e) {
                // fallback
                init.headers['Authorization'] = 'Bearer ' + storedToken;
            }
        }

        const response = await original(input, init);

        // When login/register succeeds, store token and preauthorize in the UI
        if ((input.toString().includes('/login') || input.toString().includes('/register')) && response.ok) {
            const data = await response.clone().json();
            const token = data.token;

            if (token) {
                localStorage.setItem('swagger_jwt_token', token);
                if (window.ui) {
                    try {
                        window.ui.preauthorizeApiKey('Bearer', 'Bearer ' + token);
                    } catch (e) {
                        // ignore if preauthorize isn't available
                    }
                }
            }
        }

        return response;
    };
})();
