import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

// Le o header X-Correlation-Id que o CorrelationIdMiddleware (backend, CrossCutting)
// devolve em toda resposta - facilita cruzar uma requisicao vista no DevTools do
// navegador com a linha correspondente no log do Serilog no backend.
export const correlationIdInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    tap((event) => {
      if ('headers' in event) {
        const correlationId = event.headers?.get('X-Correlation-Id');
        if (correlationId) {
          console.debug(`[${req.method} ${req.url}] X-Correlation-Id: ${correlationId}`);
        }
      }
    })
  );
};