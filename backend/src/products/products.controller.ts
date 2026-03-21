import { Controller, Get, Param, Query, Post, Body, Req, UseGuards } from '@nestjs/common';
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
}

