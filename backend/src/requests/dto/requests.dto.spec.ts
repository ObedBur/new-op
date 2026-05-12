import { validate } from 'class-validator';
import { CreateRequestDto } from './create-request.dto';
import { UpdateRequestDto } from './update-request.dto';

describe('Requests DTO Validation', () => {
  describe('CreateRequestDto', () => {
    it('should validate a correct DTO', async () => {
      const dto = new CreateRequestDto();
      dto.serviceId = '123e4567-e89b-42d3-a456-426614174000';
      dto.description = "J'ai besoin d'une réparation";
      dto.address = '12 rue de la Paix';
      dto.scheduledAt = '2026-04-09T00:00:00Z';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail if serviceId is not UUID', async () => {
      const dto = new CreateRequestDto();
      dto.serviceId = 'invalid-uuid';
      dto.description = 'desc';
      dto.address = 'addr';
      dto.scheduledAt = '2026-04-09T00:00:00Z';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('serviceId');
    });

    it('should fail if scheduledAt is missing or invalid format', async () => {
      const dto = new CreateRequestDto();
      dto.serviceId = '123e4567-e89b-42d3-a456-426614174000';
      dto.description = 'desc';
      dto.address = 'addr';
      (dto as any).scheduledAt = 'not-a-date';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('scheduledAt');
    });
  });

  describe('UpdateRequestDto', () => {
    it('should allow valid updates as partial', async () => {
      const dto = new UpdateRequestDto();
      dto.address = 'new address';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
});
