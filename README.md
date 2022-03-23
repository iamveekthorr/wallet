```
Hey There! 🙌
🤾 that ⭐️ button if you like this boilerplate.
```

- For Database - Repo contains the use of [Mongoose](https://mongoosejs.com/) (ie. [MongoDB](https://www.mongodb.com/)

# Authentication

- For Strategies Auth - Repo contains the use of the jsonwebtokens (jwt), implemented with custom strategy

# Exceptions

- For Handling Exception - Repo contains one class ie. `ErrorService` located in the `common/` folder.

# Contents

- [Global Requisites](#global-requisites)
- [App Structure](#app-structure)
- [Install, Configure & Run](#install-configure--run)
- [List of Routes](#list-of-routes)

# Global Requisites

- node (>= 10.5.0)
- tsc (>= 3.0.1)
- typescript (>= 3.0.1)
- mongoose (>= 3.6.2)

# App Structure

```bash
├── src
|   |--- types
|   |    └── express
|   |        └──index.d.ts
│   ├── auth-module
│   │   ├── controller
│   │   │   └──
│   │   ├── dto
│   │   │   ├── Login.ts
│   │   │   ├── Logout.ts
│   │   │   ├── Register.ts
│   │   │   └── Social.ts
|   |   |-- middleware
|   |   |   └──
|   |   |-- service
|   |   |   └──
|   |   |-- auth-roles.enum.ts
│   │   ├── auth.routes.ts
│   │   └── jwt-strategy.ts
│   ├── common
│   │   ├──
│   │   └──
│   ├── user-module
│   │   ├── controller
|   |   |   └── user.controller.ts
|   |   |-- dto
|   |       └── user.dto.ts
|   |
    |
    ├── .gitignore
    ├── nodemon.json
    ├── package.json
    ├── README.md
    ├── tsconfig.json
    └── eslint.json
```
