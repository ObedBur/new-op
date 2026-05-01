import { Controller, Get, Param, ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(86400) // 24 heures
  @Get()
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return {
      success: true,
      data: categories
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoriesService.findOne(id);
    return {
      success: true,
      data: category
    };
  }
}

