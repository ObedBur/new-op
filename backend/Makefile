.PHONY: help install dev build test lint prisma docker-up docker-down

help:
	@echo "Available commands:"
	@echo "  make install          - Install dependencies"
	@echo "  make dev              - Start development server"
	@echo "  make build            - Build for production"
	@echo "  make test             - Run tests"
	@echo "  make test-watch       - Run tests in watch mode"
	@echo "  make test-cov         - Run tests with coverage"
	@echo "  make lint             - Run ESLint"
	@echo "  make lint-fix         - Fix ESLint issues"
	@echo "  make format           - Format code with Prettier"
	@echo "  make prisma-generate  - Generate Prisma client"
	@echo "  make prisma-migrate   - Run database migrations"
	@echo "  make prisma-seed      - Seed database"
	@echo "  make prisma-studio   - Open Prisma Studio"
	@echo "  make docker-up        - Start Docker containers"
	@echo "  make docker-down      - Stop Docker containers"

install:
	npm install

dev:
	npm run start:dev

build:
	npm run build

test:
	npm run test

test-watch:
	npm run test:watch

test-cov:
	npm run test:cov

lint:
	npm run lint

lint-fix:
	npm run lint

format:
	npm run format

prisma-generate:
	npm run prisma:generate

prisma-migrate:
	npm run prisma:migrate:dev

prisma-seed:
	npm run prisma:seed

prisma-studio:
	npm run prisma:studio

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f
