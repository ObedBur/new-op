import { Controller, Get, Param, Query, Post, Body, Req, UseGuards, Patch, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;

    const product = await this.productsService.create({
      ...createProductDto,
    }, userId);

    return {
      success: true,
      message: 'Produit créé avec succès',
      data: product,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-products')
  async findMyProducts(
    @Req() req: any,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
    @Query('market') market?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user.id;
    const result = await this.productsService.findAll({
      userId,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      search,
      market,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });

    return {
      success: true,
      data: result.items,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        pages: result.pages,
      },
    };
  }

  // ====== GALERIES INTELLIGENTES ======

  @Get('deals')
  async getDeals(@Query('limit') limit?: string) {
    const data = await this.productsService.getDeals(limit ? parseInt(limit) : 6);
    return { success: true, data };
  }

  @Get('new-arrivals')
  async getNewArrivals(@Query('limit') limit?: string) {
    const data = await this.productsService.getNewArrivals(limit ? parseInt(limit) : 6);
    return { success: true, data };
  }

  @Get('recommendations')
  async getRecommendations(
    @Query('userId') userId?: string,
    @Query('limit') limit?: string,
  ) {
    const data = await this.productsService.getRecommendations(
      userId,
      limit ? parseInt(limit) : 6,
    );
    return { success: true, data };
  }

  @Get('best-sellers')
  async getBestSellers(@Query('limit') limit?: string) {
    const data = await this.productsService.getBestSellers(limit ? parseInt(limit) : 6);
    return { success: true, data };
  }

  @Get('compare')
  async compare(@Query('search') search: string) {
    const data = await this.productsService.compareProducts(search || '');
    return { success: true, ...data };
  }

  @Get()
  async findAll(
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
    @Query('market') market?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.productsService.findAll({
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      search,
      market,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });

    return {
      success: true,
      data: result.items,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        pages: result.pages,
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(id);
    return {
      success: true,
      data: product,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: any,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    const product = await this.productsService.update(id, updateProductDto, userId);
    return {
      success: true,
      message: 'Produit mis à jour avec succès',
      data: product,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('bulk-publish')
  async bulkPublish(
    @Body('ids') ids: string[],
    @Req() req: any,
  ) {
    const userId = req.user.id;
    await this.productsService.bulkPublish(ids, userId);
    return {
      success: true,
      message: `${ids.length} produits publiés avec succès`,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    await this.productsService.remove(id, userId);
    return {
      success: true,
      message: 'Produit supprimé avec succès',
    };
  }
}


