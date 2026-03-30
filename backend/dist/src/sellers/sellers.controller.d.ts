import { SellersService } from './sellers.service';
export declare class SellersController {
    private readonly sellersService;
    constructor(sellersService: SellersService);
    getActiveSellers(): Promise<import("./dto/seller.dto").SellerDto[]>;
}
