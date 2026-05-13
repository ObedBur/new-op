import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController, AdminServicesController } from './services.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageService } from '../common/services/storage.service';

@Module({
  imports: [PrismaModule],
  controllers: [ServicesController, AdminServicesController],
  providers: [ServicesService, StorageService],
  exports: [ServicesService],
})
export class ServicesModule {}
