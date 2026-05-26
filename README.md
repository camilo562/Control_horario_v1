# Control horario

Proyecto base con React, JavaScript, Express y MySQL.

## Comandos principales

Frontend:

```bash
cd frontend
npm run dev
```

Backend:

```bash
cd backend
npm run dev
```

## Base de datos

1. Crea la base y tabla con `database/schema.sql`.
2. Copia `backend/.env.example` a `backend/.env`.
3. Ajusta `DB_USER` y `DB_PASSWORD` segun tu instalacion de MySQL.

En este equipo el cliente MySQL oficial esta en:

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p -e "SOURCE C:/Users/usuario/Downloads/Control_horario_v1/database/schema.sql"
```

La API corre en `http://localhost:3001` y React en `http://localhost:5173`.
