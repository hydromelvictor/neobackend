declare namespace NodeJS {
    interface ProcessEnv {
        JWT_SECRET: string;
        SERVER_PORT: string;
        SERVER_HOST: string;

        NEO_HOLDING_DB: string;
        NEO_IA_DB: string;
        NEO_MARKET_DB: string;
        NEO_NETWORK_DB: string;
        NEO_SHADOW_DB: string;

        NEO_EMAIL: string;
        NEO_EMAIL_PASSWORD: string;

        MONGO_HOSTNAME: string;

        ENCRYPTION_KEY: string;
        ENCRYPTION_IV: string;
    }
}

declare module 'mongoose' {
    interface Schema {
      post<T = any>(method: 'init', fn: (this: T) => void): this;
    }
}
