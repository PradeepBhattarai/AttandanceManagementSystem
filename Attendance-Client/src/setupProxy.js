const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        "/backend",
        createProxyMiddleware({
            target: "http://localhost:3082",
            changeOrigin: true,
            pathRewrite: {
                "^/backend/": "/", // remove base path
            },
        })
    );
    app.use(
        "/api",
        createProxyMiddleware({
            target: "http://pcampus.edu.np",
            changeOrigin: true,
        })
    );
};
