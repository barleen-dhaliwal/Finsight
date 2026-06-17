import { inject, Injectable } from '@angular/core';
import { AuthTokens, JwtPayload, LoginRequest, SignUpRequest } from './auth.model';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from './token-storage.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);

  login(payload: LoginRequest): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${environment.authServiceUrl}/auth/login`, payload).pipe(
      tap((tokens) => {
        this.tokenStorage.saveTokens(tokens);
      })
    );
  }

  signUp(payload: SignUpRequest): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${environment.authServiceUrl}/auth/register`, payload).pipe(
      tap((tokens) => {
        this.tokenStorage.saveTokens(tokens);
      })
    );
  }

  refresh(refreshToken: string): Observable<AuthTokens> {
    return this.http
      .post<AuthTokens>(`${environment.authServiceUrl}/auth/refresh`, { refreshToken })
      .pipe(
        tap((tokens) => {
          this.tokenStorage.saveTokens(tokens);
        })
      );
  }

  isAccessTokenValid(): boolean {
    const token = this.tokenStorage.getAccessToken();
    if (!token) {
      return false;
    }

    try {
      const payload = jwtDecode<JwtPayload>(token);

      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  logout() {
    return this.http
      .post<AuthTokens>(`${environment.authServiceUrl}/auth/logout`, {
        refreshToken: this.tokenStorage.getRefreshToken(),
      })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        tap((_) => {
          this.tokenStorage.clearTokens();
        })
      );
  }

  getCurrentUser(): JwtPayload | null {
    const token = this.tokenStorage.getAccessToken();
    if (!token) return null;

    try {
      const payload = jwtDecode<JwtPayload>(token);
      return payload || null;
    } catch {
      return null;
    }
  }
}
