import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Contact {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  photo?: string;
  user_id?: number;
}

export interface ContactsResponse {
  data: Contact[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface ContactResponse {
  message: string;
}

export interface CreateContactRequest {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  photo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'https://www.api.4gul.kanemia.com';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Récupérer la liste des contacts avec recherche et pagination
   */
  getContacts(page: number = 1, search?: string): Observable<ContactsResponse> {
    let params = new HttpParams().set('page', page.toString());
    
    if (search) {
      params = params.set('search', search);
    }

    const headers = this.authService.getAuthHeaders();

    return this.http.get<ContactsResponse>(`${this.apiUrl}/contacts`, { 
      headers, 
      params 
    });
  }

  /**
   * Récupérer un contact spécifique par son ID
   */
  getContactById(id: number): Observable<Contact> {
    const headers = this.authService.getAuthHeaders();

    return this.http.get<Contact>(`${this.apiUrl}/contacts/${id}`, { headers });
  }

  /**
   * Ajouter un nouveau contact
   */
  createContact(contact: CreateContactRequest): Observable<ContactResponse> {
    const headers = this.authService.getAuthHeaders();

    return this.http.post<ContactResponse>(`${this.apiUrl}/contacts`, contact, { headers });
  }

  /**
   * Modifier les informations d'un contact
   */
  updateContact(id: number, contact: Partial<Contact>): Observable<ContactResponse> {
    const headers = this.authService.getAuthHeaders();

    return this.http.put<ContactResponse>(`${this.apiUrl}/contacts/${id}`, contact, { headers });
  }

  /**
   * Supprimer un contact existant
   */
  deleteContact(id: number): Observable<ContactResponse> {
    const headers = this.authService.getAuthHeaders();

    return this.http.delete<ContactResponse>(`${this.apiUrl}/contacts/${id}`, { headers });
  }

  /**
   * Méthodes utilitaires pour la compatibilité avec l'interface existante
   */

  /**
   * Convertir un Contact API vers le format de l'interface locale
   */
  private mapApiContactToLocal(apiContact: Contact): any {
    return {
      id: apiContact.id,
      firstName: apiContact.first_name,
      lastName: apiContact.last_name,
      email: apiContact.email,
      phone: apiContact.phone,
      company: '', // Non disponible dans l'API
      notes: ''    // Non disponible dans l'API
    };
  }

  /**
   * Convertir un contact local vers le format API
   */
  private mapLocalContactToApi(localContact: any): CreateContactRequest {
    return {
      user_id: 1, // À adapter selon l'utilisateur connecté
      first_name: localContact.firstName || localContact.first_name,
      last_name: localContact.lastName || localContact.last_name,
      email: localContact.email,
      phone: localContact.phone,
      photo: localContact.photo || 'photo_url.png'
    };
  }

  /**
   * Méthodes de compatibilité pour l'interface existante
   */
  getAllContacts(): Observable<any[]> {
    return this.getContacts().pipe(
      map((response: ContactsResponse) => 
        response.data.map((contact: Contact) => this.mapApiContactToLocal(contact))
      )
    );
  }

  addContact(contact: any): Observable<any> {
    const apiContact = this.mapLocalContactToApi(contact);
    return this.createContact(apiContact);
  }

  updateContactById(id: number, contact: any): Observable<any> {
    const apiContact = this.mapLocalContactToApi(contact);
    return this.updateContact(id, apiContact);
  }

  deleteContactById(id: number): Observable<any> {
    return this.deleteContact(id);
  }

  getContact(id: number): Observable<any> {
    return this.getContactById(id).pipe(
      map((contact: Contact) => this.mapApiContactToLocal(contact))
    );
  }
}

