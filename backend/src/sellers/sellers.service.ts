import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SellerDto } from './dto/seller.dto';

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}

  async findActiveVendors(): Promise<SellerDto[]> {
    const vendors = await this.prisma.user.findMany({
      where: { role: 'VENDOR', isVerified: true },
      include: {
        products: {
          take: 3,
          orderBy: { createdAt: 'desc' },
          select: { images: true },
        },
      },
    });

    return vendors.map((vendor) => ({
      id: vendor.id,
      boutiqueName: vendor.boutiqueName,
      trustScore: vendor.trustScore,
      isVerified: vendor.isVerified,
      avatarUrl: vendor.avatarUrl,
      productPreviews: vendor.products.flatMap((p) => p.images).slice(0, 3),
    }));
  }
}
