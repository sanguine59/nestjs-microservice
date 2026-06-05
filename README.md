### 1. Setup Database (XAMPP)
```bash
# nyalain XAMPP dulu, terus import schema.sql di phpMyAdmin buat bikin databasenya
```

### 2. Install & Setup Prisma (sekali aja per service)
```bash
cd auth-service && npm install && npx prisma db push && npx prisma generate
cd ../game-service && npm install && npx prisma db push && npx prisma generate
cd ../run-service && npm install && npx prisma db push && npx prisma generate
```

### 3. Jalanin Semua Service (masing-masing di terminal beda)
```bash
cd auth-service && npm run start:dev   # localhost:3000
cd game-service && npm run start:dev   # localhost:3001
cd run-service && npm run start:dev    # localhost:3002
```

### Swagger
```
Auth Service : http://localhost:3000/api
Game Service : http://localhost:3001/api
Run Service  : http://localhost:3002/api
```


// note: di docs suruh pakai "included sql file" tapi gk pernah ada dari case yang di download...