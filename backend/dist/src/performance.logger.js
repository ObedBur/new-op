"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logPerformance = logPerformance;
function logPerformance(moduleName) {
    const start = Date.now();
    return {
        done: () => {
            const duration = Date.now() - start;
            console.log(` Module ${moduleName} charg en ${duration}ms`);
        }
    };
}
//# sourceMappingURL=performance.logger.js.map