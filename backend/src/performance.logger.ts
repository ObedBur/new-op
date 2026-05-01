import { Logger } from '@nestjs/common';

const logger = new Logger('Performance');

export function logPerformance(moduleName: string) {
  const start = Date.now();
  return {
    done: () => {
      const duration = Date.now() - start;
      logger.log(`Module ${moduleName} chargé en ${duration}ms`);
    }
  };
}

