import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from '../models/contact.model';

@Pipe({
  name: 'contactFilter',
  standalone: true
})
export class ContactFilterPipe implements PipeTransform {

  transform(contacts: Contact[], searchTerm: string): Contact[] {
    if (!contacts || !searchTerm) {
      return contacts;
    }

    searchTerm = searchTerm.toLowerCase();

    return contacts.filter(contact =>
      contact.firstName.toLowerCase().includes(searchTerm) ||
      contact.lastName.toLowerCase().includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm) ||
      contact.company.toLowerCase().includes(searchTerm) ||
      contact.phone.includes(searchTerm)
    );
  }
}

