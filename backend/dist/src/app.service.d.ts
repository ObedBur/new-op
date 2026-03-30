export interface ApiInfo {
    name: string;
    version: string;
    environment: string;
    status: string;
    timestamp: string;
    message: string;
    debug?: boolean;
    tips?: string[];
    database?: string;
    prismaStudio?: string;
    nextSteps?: string[];
}
export declare class AppService {
    getApiInfo(): ApiInfo;
    getHealth(): {
        status: string;
        service: string;
        timestamp: string;
        uptime: number;
        database: string;
        checks: {
            api: string;
            database: string;
            authentication: string;
        };
    };
}
