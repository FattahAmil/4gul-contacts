import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {
  contact: Contact | null = null;
  contactId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService
  ) {}

  ngOnInit() {
    this.contactId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadContact();
  }

  loadContact() {
    this.contactService.getContact(this.contactId).subscribe({
      next: (contact) => {
        this.contact = contact;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du contact:', error);
        this.router.navigate(['/dashboard']);
      }
    });
  }

  editContact() {
    this.router.navigate(['/contact/edit', this.contactId]);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}

