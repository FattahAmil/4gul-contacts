import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { AuthService } from '../../services/auth.service';
import { Contact } from '../../models/contact.model';
import { ContactFilterPipe } from '../../pipes/contact-filter.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ContactFilterPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  paginatedContacts: Contact[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private contactService: ContactService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.isLoading = true;
    this.errorMessage = '';

    // Utiliser la nouvelle méthode API avec pagination
    this.contactService.getContacts(this.currentPage, this.searchTerm).subscribe({
      next: (response) => {
        console.log('Contacts loaded:', response);
        
        // Mapper les contacts API vers le format local
        this.contacts = response.data.map(contact => ({
          id: contact.id,
          firstName: contact.first_name,
          lastName: contact.last_name,
          email: contact.email,
          phone: contact.phone,
          company: '', // Non disponible dans l'API
          notes: '',   // Non disponible dans l'API
          photo: contact.photo
        }));
        
        this.filteredContacts = [...this.contacts];
        this.updatePaginatedContacts();
        
        // Mettre à jour la pagination avec les données de l'API
        this.totalPages = Math.ceil(response.pagination.total / response.pagination.pageSize);
        this.currentPage = response.pagination.page;
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des contacts:', error);
        this.isLoading = false;
        
        if (error.status === 401) {
          this.errorMessage = 'Session expirée. Veuillez vous reconnecter.';
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          this.errorMessage = 'Accès refusé. Vérifiez vos permissions.';
        } else if (error.status === 0) {
          this.errorMessage = 'Erreur de connexion au serveur.';
        } else {
          this.errorMessage = 'Erreur lors du chargement des contacts.';
        }
      }
    });
  }

  updateFilteredContacts() {
    // La recherche est maintenant gérée côté serveur
    this.currentPage = 1;
    this.loadContacts();
  }

  updatePaginatedContacts() {
    // La pagination est maintenant gérée côté serveur
    this.paginatedContacts = [...this.filteredContacts];
  }

  onSearchChange() {
    // Délai pour éviter trop de requêtes
    setTimeout(() => {
      this.updateFilteredContacts();
    }, 500);
  }

  viewContact(id: number) {
    this.router.navigate(['/contact', id]);
  }

  addContact() {
    this.router.navigate(['/contact/new']);
  }

  editContact(id: number) {
    this.router.navigate(['/contact/edit', id]);
  }

  deleteContact(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
      this.contactService.deleteContact(id).subscribe({
        next: (response) => {
          console.log('Contact supprimé:', response);
          this.loadContacts(); // Recharger la liste
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
          } else {
            alert('Erreur lors de la suppression du contact.');
          }
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getPages(): number[] {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadContacts();
    }
  }

  exportToCSV() {
    const csvContent = this.generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'contacts_4gul.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  private generateCSV(): string {
    const headers = ['Prénom', 'Nom', 'Email', 'Téléphone'];
    const csvRows = [headers.join(',')];
    
    this.filteredContacts.forEach(contact => {
      const row = [
        this.escapeCsvField(contact.firstName),
        this.escapeCsvField(contact.lastName),
        this.escapeCsvField(contact.email),
        this.escapeCsvField(contact.phone)
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }

  private escapeCsvField(field: string): string {
    if (field && (field.includes(',') || field.includes('"') || field.includes('\n'))) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field || '';
  }
}

