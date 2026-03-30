import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getApiInfo(): import("./app.service").ApiInfo;
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
