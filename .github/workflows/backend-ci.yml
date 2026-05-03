name: WapiBei Backend CI

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'backend/**'
  pull_request:
    branches: [ main ]
    paths:
      - 'backend/**'

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🟢 Setup Node.js 24
        uses: actions/setup-node@v4
        with:
          node-version: '24'

      - name: 📦 Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: 🛠️ Install Dependencies
        working-directory: ./backend
        run: pnpm install

      - name: 💎 Generate Prisma Client
        working-directory: ./backend
        run: npx prisma generate
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: 🔍 Prisma Schema Validation
        working-directory: ./backend
        run: npx prisma validate
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: 🏗️ Build Backend
        working-directory: ./backend
        run: pnpm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}