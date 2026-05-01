import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreateProductDto } from './create-product.dto';
import { plainToInstance } from 'class-transformer';

describe('CreateProductDto', () => {
  it('should pass with valid data', async () => {
    const data = {
      name: 'Samsung S21',
      price: 800,
      categoryId: 1,
      description: 'Super smartphone',
    };
    const dto = plainToInstance(CreateProductDto, data);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if name is empty', async () => {
    const data = {
      name: '',
      price: 800,
      categoryId: 1,
    };
    const dto = plainToInstance(CreateProductDto, data);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail if price is negative', async () => {
    const data = {
      name: 'Samsung S21',
      price: -50,
      categoryId: 1,
    };
    const dto = plainToInstance(CreateProductDto, data);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should fail if categoryId is missing', async () => {
    const data = {
      name: 'Samsung S21',
      price: 800,
    };
    const dto = plainToInstance(CreateProductDto, data);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should convert price string to number and validate', async () => {
    const data = {
      name: 'Samsung S21',
      price: '850', // Doit être transformé en number
      categoryId: 1,
    };
    const dto = plainToInstance(CreateProductDto, data);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
    expect(typeof dto.price).toBe('number');
  });
});
