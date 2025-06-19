import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContactService, CreateContactRequest } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;
  isEditMode: boolean = false;
  contactId: number = 0;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService,
    private authService:AuthService
  ) {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.contactId = Number(id);
      this.loadContact();
    }
  }

  loadContact() {
    this.isLoading = true;
    this.contactService.getContactById(this.contactId).subscribe({
      next: (contact) => {
        this.contactForm.patchValue({
          firstName: contact.first_name,
          lastName: contact.last_name,
          email: contact.email,
          phone: contact.phone
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du contact:', error);
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du chargement du contact.';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      }
    });
  }

  onSubmit() {
    if (this.contactForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';
      const id_user = Number(this.authService.getId());
      
      const formValue = this.contactForm.value;
      
      if (this.isEditMode) {
        const updateData = {
          first_name: formValue.firstName,
          last_name: formValue.lastName,
          email: formValue.email,
          phone: formValue.phone,
          photo: 'photo_url.png'
        };
        
        this.contactService.updateContact(this.contactId, updateData).subscribe({
          next: (response) => {
            console.log('Contact mis à jour:', response);
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.error('Erreur lors de la modification:', error);
            this.isLoading = false;
            this.errorMessage = 'Erreur lors de la modification du contact.';
          }
        });
      } else {
        const contactData: CreateContactRequest = {
          user_id: id_user , // À adapter selon l'utilisateur connecté
          first_name: formValue.firstName,
          last_name: formValue.lastName,
          email: formValue.email,
          phone: formValue.phone,
          photo: 'photo_url.png'
        };
        
        this.contactService.createContact(contactData).subscribe({
          next: (response) => {
            console.log('Contact créé:', response);
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.error('Erreur lors de la création:', error);
            this.isLoading = false;
            
            if (error.status === 400) {
              this.errorMessage = 'Données invalides. Vérifiez les champs requis.';
            } else if (error.status === 404) {
              this.errorMessage = 'Utilisateur non trouvé.';
            } else {
              this.errorMessage = 'Erreur lors de la création du contact.';
            }
          }
        });
      }
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}

