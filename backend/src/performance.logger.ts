// performance.logger.ts
export function logPerformance(moduleName: string) {
  const start = Date.now();
  return {
    done: () => {
      const duration = Date.now() - start;
      console.log(` Module ${moduleName} charg en ${duration}ms`);
    }
  };
}

