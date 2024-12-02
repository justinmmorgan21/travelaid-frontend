const apiConfig = {
  proxyServerUrl:
    import.meta.env.MODE === "production"
      ? "https://travelaid-proxy.onrender.com"
      : "http://localhost:3001",
  backendBaseUrl:
    import.meta.env.MODE === "production"
      ? "https://travelaid-api.onrender.com"
      : "http://localhost:3000",
};

export default apiConfig;
