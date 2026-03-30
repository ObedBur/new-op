import { PrismaService } from '../prisma/prisma.service';
import { SellerDto } from './dto/seller.dto';
export declare class SellersService {
    private prisma;
    constructor(prisma: PrismaService);
    findActiveVendors(): Promise<SellerDto[]>;
    findOneVendor(id: string): Promise<any>;
}
