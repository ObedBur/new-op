import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Pour être accessible partout
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}