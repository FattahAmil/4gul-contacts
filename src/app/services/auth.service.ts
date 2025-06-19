import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  photo: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
    token: string;
    photo: string;
  };
}

export interface CheckTokenResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://www.api.4gul.kanemia.com';
  private tokenKey = 'auth_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  /**
   * Authentifier un utilisateur et obtenir un token d'accès
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials, { headers })
      .pipe(
        tap(response => {
          console.log(response);
          if (response.user.token && response.user.id) {
            this.setToken(response.user.token,response.user.id.toString());
          }
        })
      );
  }

  register(credentials: RegisterRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}/users`, credentials, { headers })
      .pipe(
        tap(response => {
          console.log(response);
          
        })
      );
  }

  /**
   * Vérifier la validité d'un token
   */
  checkToken(): Observable<CheckTokenResponse> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token available');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<CheckTokenResponse>(`${this.apiUrl}/auth/check-token`, {}, { headers });
  }

  /**
   * Stocker le token dans localStorage
   */
  setToken(token: string,id:string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem("id", id);

    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Récupérer le token depuis localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getId(): string | null {
    return localStorage.getItem("id");
  }
  /**
   * Vérifier si un token existe
   */
  hasToken(): boolean {
    return !!this.getToken();
  }

  /**
   * Supprimer le token et déconnecter l'utilisateur
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Observable pour surveiller l'état d'authentification
   */
  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  /**
   * Vérifier si l'utilisateur est actuellement authentifié
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Obtenir les headers d'autorisation pour les requêtes API
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token available');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}

