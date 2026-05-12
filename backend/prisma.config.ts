<<<<<<< HEAD
import "dotenv/config";
import { defineConfig, env } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
       url: env("DATABASE_URL"), 
=======
import { defineConfig } from '@prisma/config';
import 'dotenv/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',

  migrations: {
    seed: 'ts-node ./prisma/seed.ts',
  },

  datasource: {
    url: process.env.DATABASE_URL,
>>>>>>> 290370a19af069c11dcba02e6949aa48c45160ef
  },
});