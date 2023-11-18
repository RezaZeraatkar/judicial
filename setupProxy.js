const createProxyMiddleware = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/",
    createProxyMiddleware({
      target: `${process.env.REACT_APP_API_BASE_JUDICIAL_URL}`,
      // target: "http://172.20.8.149:8081",
      changeOrigin: true,
    }),
  );
};
