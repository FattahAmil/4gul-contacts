# 4GUL Contacts - Application Angular 19 avec Intégration API

## Description
Application de gestion de contacts développée en Angular 19 avec intégration complète de l'API 4GUL Kanemia.

## Nouvelles fonctionnalités - Intégration API

### ✅ Authentification API
- Connexion via l'endpoint `/auth/login` de l'API 4GUL
- Gestion des tokens JWT avec stockage sécurisé
- Vérification de validité des tokens via `/auth/check-token`
- Gestion automatique des erreurs d'authentification

### ✅ Gestion des contacts via API
- **GET /contacts** : Récupération de la liste avec pagination et recherche
- **GET /contacts/{id}** : Récupération d'un contact spécifique
- **POST /contacts** : Création de nouveaux contacts
- **PUT /contacts/{id}** : Modification des contacts existants
- **DELETE /contacts/{id}** : Suppression des contacts

### ✅ Fonctionnalités avancées
- Pagination côté serveur pour de meilleures performances
- Recherche en temps réel via l'API
- Gestion complète des erreurs HTTP (401, 403, 404, 500)
- Messages d'erreur contextuels pour l'utilisateur
- Indicateurs de chargement pendant les requêtes

## Structure API intégrée

### Endpoints utilisés
```
Base URL: https://www.api.4gul.kanemia.com

Authentication:
- POST /auth/login
- POST /auth/check-token

Contacts:
- GET /contacts?page={page}&search={search}
- GET /contacts/{id}
- POST /contacts
- PUT /contacts/{id}
- DELETE /contacts/{id}

Users:
- POST /users (pour la création d'utilisateurs)
```

### Format des données
```typescript
// Authentification
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    token: string;
    photo: string;
  };
}

// Contacts
interface Contact {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  photo?: string;
  user_id?: number;
}

interface ContactsResponse {
  data: Contact[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}
```

## Services mis à jour

### AuthService
- `login(credentials)` : Authentification via API
- `checkToken()` : Vérification de validité du token
- `getAuthHeaders()` : Headers d'autorisation pour les requêtes
- `isAuthenticated()` : État d'authentification en temps réel

### ContactService
- `getContacts(page, search)` : Liste paginée avec recherche
- `getContactById(id)` : Contact spécifique
- `createContact(contact)` : Création via API
- `updateContact(id, contact)` : Modification via API
- `deleteContact(id)` : Suppression via API

## Gestion des erreurs

### Codes d'erreur gérés
- **401 Unauthorized** : Token invalide ou expiré → Redirection vers login
- **403 Forbidden** : Accès refusé → Message d'erreur
- **404 Not Found** : Ressource non trouvée → Message d'erreur
- **400 Bad Request** : Données invalides → Validation des champs
- **500 Server Error** : Erreur serveur → Message générique

### Fonctionnalités de récupération
- Déconnexion automatique en cas de token expiré
- Retry automatique pour les erreurs temporaires
- Messages d'erreur contextuels et informatifs

## Installation et utilisation

1. Extraire le fichier zip
2. Naviguer dans le dossier du projet
3. Installer les dépendances : `npm install --legacy-peer-deps`
4. Corriger l'import de zone.js si nécessaire dans `src/main.ts`
5. Lancer l'application : `npm start`
6. Ouvrir http://localhost:4200

## Configuration API

L'URL de l'API est configurée dans les services :
```typescript
private apiUrl = 'https://www.api.4gul.kanemia.com';
```

Pour changer l'URL de l'API, modifiez cette constante dans :
- `src/app/services/auth.service.ts`
- `src/app/services/contact.service.ts`

## Tests avec l'API réelle

L'application est maintenant configurée pour fonctionner avec l'API 4GUL. Pour tester :

1. Créez un compte utilisateur via l'endpoint `/users` si nécessaire
2. Utilisez les identifiants réels pour vous connecter
3. Toutes les opérations CRUD sont maintenant connectées à l'API

## Compatibilité

- ✅ Angular 19
- ✅ TypeScript
- ✅ RxJS pour la gestion asynchrone
- ✅ HttpClient pour les requêtes API
- ✅ Gestion des CORS
- ✅ Headers d'autorisation Bearer Token

## Sécurité

- Tokens JWT stockés de manière sécurisée
- Headers d'autorisation automatiques
- Validation côté client et serveur
- Gestion des sessions expirées
- Protection des routes sensibles

## Notes techniques

- L'application gère automatiquement la pagination côté serveur
- La recherche est déportée sur l'API pour de meilleures performances
- Les erreurs réseau sont gérées avec des messages utilisateur appropriés
- Le mapping entre l'interface locale et l'API est transparent

