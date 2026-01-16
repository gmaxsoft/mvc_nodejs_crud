# Node.js MVC CRUD Application

Aplikacja CRUD (Create, Read, Update, Delete) zbudowana w architekturze MVC (Model-View-Controller) używając Node.js, Express.js i MongoDB. Projekt zawiera pełny system autoryzacji z JWT, role użytkowników oraz RESTful API.

## 🚀 Funkcjonalności

- ✅ **CRUD Operations** - Pełne operacje na danych (pracownicy, użytkownicy)
- ✅ **JWT Authentication** - Bezpieczna autoryzacja z tokenami JWT
- ✅ **Role-Based Access Control (RBAC)** - System ról (Admin, Editor, User)
- ✅ **Refresh Tokens** - Odświeżanie tokenów przez cookies
- ✅ **Password Hashing** - Haszowanie haseł z bcrypt
- ✅ **CORS Support** - Konfiguracja Cross-Origin Resource Sharing
- ✅ **Error Handling** - Centralna obsługa błędów
- ✅ **Request Logging** - Logowanie żądań HTTP
- ✅ **MongoDB Integration** - Integracja z MongoDB przez Mongoose

## 📋 Wymagania

- Node.js (wersja 20.x)
- MongoDB (lokalna instalacja lub MongoDB Atlas)
- npm lub yarn

## 🛠️ Technologie

- **Backend Framework:** Express.js
- **Database:** MongoDB z Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcrypt
- **Environment Variables:** dotenv
- **CORS:** cors
- **Cookies:** cookie-parser
- **Utilities:** uuid, date-fns

## 📦 Instalacja

1. **Sklonuj repozytorium**

```bash
git clone https://github.com/gmaxsoft/mvc_nodejs_crud.git
cd mvc_nodejs_crud
```

2. **Zainstaluj zależności**

```bash
npm install
```

3. **Skonfiguruj zmienne środowiskowe**

Utwórz plik `.env` w głównym katalogu projektu i dodaj następujące zmienne:

```env
PORT=3500
DATABASE_URI=mongodb://localhost:27017/nazwa_bazy_danych
# lub dla MongoDB Atlas:
# DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/nazwa_bazy_danych

# JWT Secret (wygeneruj bezpieczny losowy string)
ACCESS_TOKEN_SECRET=twoj_secret_key_dla_access_token
REFRESH_TOKEN_SECRET=twoj_secret_key_dla_refresh_token
```

4. **Uruchom serwer**

```bash
# Tryb produkcyjny
npm start

# Tryb deweloperski (z auto-reload)
npm run dev
```

Serwer będzie dostępny pod adresem: `http://localhost:3500`

## 📁 Struktura projektu

```
mvc_nodejs_crud/
├── app/
│   ├── controllers/          # Kontrolery (logika biznesowa)
│   │   ├── authController.js
│   │   ├── employeesController.js
│   │   ├── logoutController.js
│   │   ├── refreshTokenController.js
│   │   ├── registerController.js
│   │   └── usersController.js
│   ├── middleware/           # Middleware
│   │   ├── credentials.js
│   │   ├── errorHandler.js
│   │   ├── logEvents.js
│   │   ├── verifyJWT.js
│   │   └── verifyRoles.js
│   ├── model/               # Modele danych
│   │   ├── Employee.js
│   │   ├── User.js
│   │   ├── employees.json
│   │   └── users.json
│   ├── routes/              # Definicje tras
│   │   ├── api/
│   │   │   ├── employees.js
│   │   │   └── users.js
│   │   ├── auth.js
│   │   ├── logout.js
│   │   ├── refresh.js
│   │   ├── register.js
│   │   └── root.js
│   └── views/               # Widoki HTML
│       ├── 404.html
│       └── index.html
├── config/                  # Konfiguracja
│   ├── allowedOrigins.js
│   ├── corsOptions.js
│   ├── dbConn.js
│   └── roles_list.js
├── public/                  # Pliki statyczne
│   └── assets/
│       ├── css/
│       └── js/
├── server.js                # Główny plik serwera
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Autoryzacja (Publiczne)

- `POST /register` - Rejestracja nowego użytkownika
- `POST /auth` - Logowanie (zwraca access token i refresh token)
- `GET /refresh` - Odświeżanie access token
- `POST /logout` - Wylogowanie

### Pracownicy (Wymaga JWT)

- `GET /employees` - Pobierz wszystkich pracowników
- `GET /employees/:id` - Pobierz pracownika po ID
- `POST /employees` - Utwórz nowego pracownika (Admin, Editor)
- `PUT /employees` - Aktualizuj pracownika (Admin, Editor)
- `DELETE /employees` - Usuń pracownika (Admin)

### Użytkownicy (Wymaga JWT)

- `GET /users` - Pobierz wszystkich użytkowników
- `GET /users/:id` - Pobierz użytkownika po ID
- `POST /users` - Utwórz nowego użytkownika
- `PUT /users` - Aktualizuj użytkownika
- `DELETE /users` - Usuń użytkownika

## 🔐 Role użytkowników

- **Admin** - Pełny dostęp do wszystkich operacji
- **Editor** - Może tworzyć i edytować, ale nie usuwać
- **User** - Tylko odczyt danych

## 📝 Przykłady użycia API

### Rejestracja użytkownika

```bash
POST /register
Content-Type: application/json

{
  "username": "jan_kowalski",
  "password": "haslo123",
  "roles": ["User"]
}
```

### Logowanie

```bash
POST /auth
Content-Type: application/json

{
  "username": "jan_kowalski",
  "password": "haslo123"
}
```

Odpowiedź zawiera:
- `accessToken` - token dostępowy (krótki czas życia)
- `refreshToken` - token odświeżający (dłuższy czas życia, zapisywany w cookie)

### Pobranie pracowników (z tokenem)

```bash
GET /employees
Authorization: Bearer <access_token>
```

### Utworzenie pracownika (Admin/Editor)

```bash
POST /employees
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "firstname": "Jan",
  "lastname": "Kowalski",
  "position": "Developer"
}
```

## 🔒 Bezpieczeństwo

- Hasła są haszowane przy użyciu bcrypt
- JWT tokens z podpisem cyfrowym
- Refresh tokens przechowywane w bezpiecznych cookies
- Role-based access control (RBAC)
- CORS skonfigurowany dla bezpiecznych żądań
- Walidacja danych wejściowych

## 🐛 Rozwiązywanie problemów

### Problem z połączeniem do MongoDB

Upewnij się, że:
- MongoDB jest uruchomiony lokalnie lub masz dostęp do MongoDB Atlas
- `DATABASE_URI` w pliku `.env` jest poprawnie skonfigurowany
- Masz odpowiednie uprawnienia do bazy danych

### Błędy autoryzacji

- Sprawdź czy token JWT jest poprawnie wysyłany w nagłówku `Authorization`
- Upewnij się, że token nie wygasł
- Sprawdź czy użytkownik ma odpowiednie role do wykonania operacji

## 📄 Licencja

Ten projekt jest licencjonowany na licencji GPL-3.0-only.

## 👤 Autor

Maxsoft - Projekt stworzony jako przykład aplikacji MVC w Node.js.

## ⭐ Podziękowania

Jeśli ten projekt jest dla Ciebie przydatny, rozważ postawienie gwiazdki ⭐!
