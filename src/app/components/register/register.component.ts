import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      photo: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  navigateTo(){
    this.router.navigate(['/login']);
  }

  onSubmit() {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('register successful:', response);
          this.router.navigate(['/login']);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('register error:', error);
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
