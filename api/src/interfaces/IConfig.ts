export interface IConfig {
    port: number,
    allowCors: boolean,
    staticDirectory: string,
    showErrors: boolean,
    mongodb: IMongoConfig
}

export interface IMongoConfig {
    host: string,
    port: number,
    user: string,
    password: string,
    db: string
}