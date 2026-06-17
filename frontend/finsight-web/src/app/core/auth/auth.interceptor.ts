import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

import { TokenStorageService } from './token-storage.service';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const accessToken = tokenStorage.getAccessToken();

  const publicEndpoints = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

  const isPublicEndpoint = publicEndpoints.some((endpoint) => req.url.includes(endpoint));

  const authReq =
    accessToken && !isPublicEndpoint
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || isPublicEndpoint) {
        return throwError(() => error);
      }

      const refreshToken = tokenStorage.getRefreshToken();

      if (!refreshToken) {
        tokenStorage.clearTokens();
        router.navigate(['/login']);
        return throwError(() => error);
      }

      return authService.refresh(refreshToken).pipe(
        switchMap((tokens) => {
          tokenStorage.saveTokens(tokens);

          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          });

          return next(retryReq);
        }),
        catchError((refreshError) => {
          tokenStorage.clearTokens();
          router.navigate(['/login']);
          return throwError(() => refreshError);
        })
      );
    })
  );
};
