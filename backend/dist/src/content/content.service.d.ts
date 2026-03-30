import { PrismaService } from '../prisma/prisma.service';
import { HomepageContentDto } from './dto/homepage-content.dto';
export declare class ContentService {
    private prisma;
    constructor(prisma: PrismaService);
    getHomepageContent(): Promise<HomepageContentDto>;
}
