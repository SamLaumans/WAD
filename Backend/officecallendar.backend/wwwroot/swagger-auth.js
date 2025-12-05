(function () {
    const original = window.fetch;

    window.fetch = async (input, init) => {
        const response = await original(input, init);

        if (input.toString().includes("/login") && response.ok) {
            const data = await response.clone().json();
            const token = data.token;

            if (token) {
                const interval = setInterval(() => {
                    const ui = sessionStorage.getItem("swagger-ui-authorization");

                    SwaggerUIBundle({
                        requestInterceptor: (req) => {
                            req.headers["Authorization"] = "Bearer " + token;
                            return req;
                        }
                    });

                    clearInterval(interval);
                }, 500);
            }
        }

        return response;
    };
})();
