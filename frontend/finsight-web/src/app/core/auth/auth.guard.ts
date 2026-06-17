import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { TokenStorageService } from './token-storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const tokenStorage = inject(TokenStorageService);

  if (authService.isAccessTokenValid()) {
    return true;
  }

  if (tokenStorage.getRefreshToken()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: {
      returnUrl: state.url,
    },
  });
};
