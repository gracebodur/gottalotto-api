module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://malek_grace@localhost/gottalotto",
    JWT_SECRET: process.env.JWT_SECRET || "change-this-secret",
    API_ENDPOINT: process.env.API_ENDPOINT || "https://gentle-coast-37502.herokuapp.com/api"
}