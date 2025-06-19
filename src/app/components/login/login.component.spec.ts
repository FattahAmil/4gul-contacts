import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from '../components/login/login.component';
import { AuthService } from '../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'setToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should mark form as valid when filled correctly', () => {
    component.loginForm.patchValue({
      email: 'test@test.com',
      password: 'password123'
    });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should call authService.login on form submit', () => {
    const mockResponse = { token: 'test-token', user: {} };
    authService.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      email: 'test@test.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123'
    });
  });

  it('should navigate to dashboard on successful login', () => {
    const mockResponse = { token: 'test-token', user: {} };
    authService.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      email: 'test@test.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(authService.setToken).toHaveBeenCalledWith('test-token');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error message on login failure', () => {
    authService.login.and.returnValue(throwError(() => new Error('Login failed')));

    component.loginForm.patchValue({
      email: 'test@test.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Erreur de connexion. Vérifiez vos identifiants.');
  });
});

