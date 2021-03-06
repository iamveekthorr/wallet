```
Hey There! π
π€Ύ that β­οΈ button if you like this boilerplate.
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
βββ src
|   |--- types
|   |    βββ express
|   |        βββindex.d.ts
β   βββ auth-module
β   β   βββ controller
β   β   β   βββ
β   β   βββ dto
β   β   β   βββ Login.ts
β   β   β   βββ Logout.ts
β   β   β   βββ Register.ts
β   β   β   βββ Social.ts
|   |   |-- middleware
|   |   |   βββ
|   |   |-- service
|   |   |   βββ
|   |   |-- auth-roles.enum.ts
β   β   βββ auth.routes.ts
β   β   βββ jwt-strategy.ts
β   βββ common
β   β   βββ
β   β   βββ
β   βββ user-module
β   β   βββ controller
|   |   |   βββ user.controller.ts
|   |   |-- dto
|   |       βββ user.dto.ts
|   |
    |
    βββ .gitignore
    βββ nodemon.json
    βββ package.json
    βββ README.md
    βββ tsconfig.json
    βββ eslint.json
```
