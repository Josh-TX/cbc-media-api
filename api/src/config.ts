var config = {
    port: 80,
    allowCors: true,
    staticDirectory: "../www",
    openApiFile: "../openapi.json",
    showErrors: true,
    mongodb: {
        host: "123.mlab.com",
        port: 54321,
        user: "admin",
        password: "password",
        db: "main_db"
    }
}

export default config;