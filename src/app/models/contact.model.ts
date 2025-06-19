export interface Contact {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
  first_name?: string;
  last_name?: string;
  photo?: string;
  user_id?: number;
}

export interface ApiContact {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  photo?: string;
  user_id?: number;
}

export interface ContactsResponse {
  data: ApiContact[];
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

