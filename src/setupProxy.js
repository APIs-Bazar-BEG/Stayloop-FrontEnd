const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/auth",
    createProxyMiddleware({
      target: "https://stayloop-api.onrender.com",
      changeOrigin: true,
    })
  );
};
