import { TestBed } from '@angular/core/testing';
import { AuthService } from '../services/auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store token in localStorage', () => {
    const token = 'test-token';
    service.setToken(token);
    expect(localStorage.getItem('authToken')).toBe(token);
  });

  it('should retrieve token from localStorage', () => {
    const token = 'test-token';
    localStorage.setItem('authToken', token);
    expect(service.getToken()).toBe(token);
  });

  it('should return true if user is logged in', () => {
    localStorage.setItem('authToken', 'test-token');
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should return false if user is not logged in', () => {
    localStorage.removeItem('authToken');
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should remove token on logout', () => {
    localStorage.setItem('authToken', 'test-token');
    service.logout();
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  it('should make login request', () => {
    const credentials = { email: 'test@test.com', password: 'password' };
    const mockResponse = { token: 'test-token', user: {} };

    service.login(credentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://www.api.4gul.kanemia.com/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(mockResponse);
  });
});

