import { Controller, Get, Param, ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }
  // On met en cache les catégories pour 24 heures
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(86400)
  @Get()
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return {
      success: true,
      data: categories
    };
  }
  // Recherche d'une catégorie par id
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoriesService.findOne(id);
    return {
      success: true,
      data: category
    };
  }
}

