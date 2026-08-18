import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);
    private readonly exposeDebug =
        process.env.NODE_ENV !== 'production' && process.env.EXPOSE_ERROR_DEBUG === 'true';

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Une erreur interne est survenue. Veuillez réessayer plus tard.';
        let code: string | undefined;
        let isOperational = false;

        // ============ ERREURS HTTP (Opérationnelles) ============
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            // Récupérer le message depuis la réponse
            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                message = (exceptionResponse as any).message || exception.message;
                code = (exceptionResponse as any).code;
            } else {
                message = exception.message;
            }

            isOperational = true;
        }
        // ============ ERREURS DE BASE DE DONNÉES ============
        else if (exception instanceof Error) {
            const errorName = exception.name;

            // Prisma errors
            if (errorName === 'PrismaClientValidationError') {
                status = HttpStatus.BAD_REQUEST;
                message = 'Données invalides. Veuillez vérifier vos informations.';
                this.logger.error(`Prisma Validation Error: ${exception.message}`);
                isOperational = true;
            } else if (errorName === 'PrismaClientKnownRequestError') {
                status = HttpStatus.INTERNAL_SERVER_ERROR;
                message = 'Une erreur de base de données est survenue.';
                this.logger.error(`Prisma Known Error: ${exception.message}`);
            } else if (errorName === 'PrismaClientRustPanicError') {
                status = HttpStatus.INTERNAL_SERVER_ERROR;
                message = 'Une erreur critique est survenue. Veuillez contacter le support.';
                this.logger.error(`Prisma Panic Error: ${exception.message}`);
            }
            // Autres erreurs
            else {
                this.logger.error(`Unhandled Error [${errorName}]: ${exception.message}\n${exception.stack}`);
            }
        } else {
            // Erreur inconnue (pas un Error object)
            this.logger.error(`Unknown error caught:`, exception);
        }

        // ============ RÉPONSE ============
        response.code(status).send({
            success: false,
            statusCode: status,
            message,
            ...(code !== undefined && { code }),
            timestamp: new Date().toISOString(),
            ...(this.exposeDebug && {
                // Afficher le détail SEULEMENT en développement
                debug: {
                    error: exception instanceof Error ? exception.message : String(exception),
                    stack: exception instanceof Error ? exception.stack : undefined,
                },
            }),
        });
    }
}
