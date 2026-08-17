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
          where: { isPublic: true },
          select: { images: true, image: true },
        },
        _count: {
          select: {
            products: { where: { isPublic: true } },
          },
        },
      },
    });

    const vendorIds = vendors.map((v) => v.id);

    const salesAggregates = await this.prisma.product.groupBy({
      by: ['userId'],
      where: { userId: { in: vendorIds } },
      _sum: { totalSales: true },
    });

    const salesByVendor: Record<string, number> = {};
    for (const agg of salesAggregates) {
      salesByVendor[agg.userId] = agg._sum.totalSales ?? 0;
    }


    return vendors.map((vendor) => ({
      id: vendor.id,
      boutiqueName: vendor.boutiqueName ?? '',
      trustScore: vendor.trustScore,
      isVerified: vendor.isVerified,
      avatarUrl: vendor.avatarUrl,
      productPreviews: vendor.products.flatMap((p) => {
        if (p.images && p.images.length > 0) {
          return p.images;
        }
        return p.image ? [p.image] : [];
      }).slice(0, 3),
      productCount: vendor._count.products,
      salesCount: salesByVendor[vendor.id] ?? 0,
      isOnline: false,
    }));
  }

  async findOneVendor(id: string, viewerId?: string): Promise<any> {
    const [vendor, follow] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id, role: 'VENDOR' } as any,
        include: {
          products: {
            orderBy: { createdAt: 'desc' },
            include: {
              category: true,
              user: {
                select: {
                  id: true,
                  fullName: true,
                  boutiqueName: true,
                  isVerified: true,
                  trustScore: true,
                  phone: true,
                  avatarUrl: true,
                },
              },
            },
            where: { isPublic: true },
          },
        } as any,
      }) as any,
      viewerId
        ? this.prisma.follow.findUnique({
            where: {
              followerId_vendorId: {
                followerId: viewerId,
                vendorId: id,
              },
            },
          })
        : null,
    ]);

    if (!vendor) return null;

    return {
      id: vendor.id,
      boutiqueName: vendor.boutiqueName,
      fullName: vendor.fullName,
      email: vendor.email,
      phone: vendor.phone,
      trustScore: vendor.trustScore,
      isVerified: vendor.isVerified,
      avatarUrl: vendor.avatarUrl,
      isFollowed: Boolean(follow),
      products: vendor.products,
      productCount: (vendor.products || []).length,
      createdAt: vendor.createdAt,
    };
  }

  async toggleFollow(followerId: string, vendorId: string) {
    const existing = await this.prisma.follow.findUnique({
      where: {
        followerId_vendorId: {
          followerId,
          vendorId,
        },
      },
    });

    if (existing) {
      await this.prisma.follow.delete({
        where: { id: existing.id },
      });
      return { followed: false };
    } else {
      await this.prisma.follow.create({
        data: {
          followerId,
          vendorId,
        },
      });
      return { followed: true };
    }
  }
}
