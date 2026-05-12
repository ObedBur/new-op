<<<<<<< HEAD
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Pour être accessible partout
=======
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
>>>>>>> 290370a19af069c11dcba02e6949aa48c45160ef
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
