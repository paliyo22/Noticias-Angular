import { catchError, Observable, switchMap, throwError } from "rxjs";
import { AuthService } from "../service/auth.service";



/**
 * Wrapper para ejecutar una petición HTTP con manejo automático de refresh.
 * @param requestFn - una función que retorna un Observable (petición HTTP)
 */
export function withAuthRetry<T>(
  requestFn: () => Observable<T>,
  authService: AuthService
): Observable<T> {
  return requestFn().pipe(
    catchError(err => {
      if (err.status === 401 || err.status === 403) {
        return authService.refresh$().pipe(
          switchMap(success => success ? requestFn() : throwError(() => err)),
          catchError(() => throwError(() => err))
        );
      }
      return throwError(() => err);
    })
  );
}
