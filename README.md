# Project Title

Shopping web application with predicting techniques

## Acknowledgements

- My supervisor and the committee at school

## Requirements

- Postgresql server install
- Have superuser and password for postgres (or user default account:postgres, password:windows login pass when start computer)
- Node installed

## Installation

Install my-project:

Step 1: create folder:

```bash
  mkdir project
  cd project
```

Step 2: git clone back-end and install dependencies

```bash
  # clone back-end
  git clone git@github.com:phuongle841/thesisBackEnd.git
  cd thesisBackEnd
  npm install
  # install prisma
  npm install prisma --save-dev
```

Step 3: create .env file

```bash
  touch .env
  # exit back-end directory
  cd ../
```

In this .env file need these information and change super user information accordingly for your system in DATABASE_URL and TEST_DATABASE_URL:

```bash
  PORT=3000

  user = "leminhphuong"
  userEmail = "ITITIU20281@student.hcmiu.edu.vn"
  password =  "leminhphuong"
  userBackgroundUrl ="https://images.unsplash.com/photo-1548869447-faef5000334c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  userAvatarUrl = "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
  seed = "123"
  saltRounds = 10
  secretKey = "secretKey"

  DATABASE_URL="postgresql://<superuser-account>:<superuser-password>@localhost:5432/SmartShoppingApp?schema=public"
  TEST_DATABASE_URL="postgresql://:<superuser-account><superuser-password>@localhost:5432/test_SmartShoppingApp?schema=public"

```

Step 4: Connect prisma to postgres and seeding database

```bash
  npm run updateAndReseed
  # exit back-end directory
  cd ../
```

Step 3: git clone front-end user and install dependencies

```bash
  # clone front-end user
  git clone git@github.com:phuongle841/thesisFrontEnd_User.git
  cd thesisFrontEnd_User
  npm install
  cd ../
```

Step 5: git clone front-end admin and install dependencies

```bash
  # clone front-end admin
  git clone git@github.com:phuongle841/thesisFrontEnd_Admin.git
  cd thesisFrontEnd_Admin
  npm install
  cd ../
```

## Run Locally

Start the server

```bash
  # At thesisBackEnd
  npm run dev
```

Start User UI server

```bash
  # At thesisFrontEnd_User
  # Script will auto open browser and redirect to http://localhost:5173/
  npm run dev
```

Start Admin UI server

```bash
  # At thesisFrontEnd_Admin
  npm run dev
```

## Tech Stack

**Client:** React, React context, Material UI, Vanilla css

**Server:** Node, Express

**Database:** Postgresql, Prisma
