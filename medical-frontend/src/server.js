const express = require("express");
const cors = require("cors");
const proxy = require("http-proxy-middleware");

const app = express();
app.use(cors());
app.use(express.json());

// Proxy requests to the Flask backend
app.use(
  "/api",
  proxy.createProxyMiddleware({
    target: "http://localhost:5000", // Flask server URL
    changeOrigin: true,
    pathRewrite: { "^/api": "" }, // Removes `/api` prefix when forwarding
  })
);

// Start the Node.js server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
