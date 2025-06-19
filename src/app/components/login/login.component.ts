import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ["./login.component.css"]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  navigateTo(){
    this.router.navigate(['/register']);
  }
  
  
  onSubmit() {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.router.navigate(['/dashboard']);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Login error:', error);
          this.isLoading = false;
          
          if (error.status === 401) {
            this.errorMessage = 'Email ou mot de passe incorrect.';
          } else if (error.status === 0) {
            this.errorMessage = 'Erreur de connexion au serveur. Vérifiez votre connexion internet.';
          } else {
            this.errorMessage = 'Erreur de connexion. Veuillez réessayer.';
          }
        }
      });
    }
  }
}

