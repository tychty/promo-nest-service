# promo-nest-service

NestJS сервис для управления промокодами с PostgreSQL (Drizzle ORM).

## Требования

- Node.js >= 18
- pnpm
- PostgreSQL

## Установка

```bash
pnpm install
```

## Настройка окружения

Создайте файл `.env` в корне проекта:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
PORT=3000
```

## Миграции базы данных

Применить схему к базе данных:

```bash
pnpm drizzle-kit push
```

Таблицы создаются в схеме `public`.

## Запуск

Режим разработки (с hot-reload):

```bash
pnpm start:dev
```

Production:

```bash
pnpm build
pnpm start:prod
```

Сервис запустится на `http://localhost:3000` (или на порту из `PORT`).

## API

### Промокоды

| Метод | Путь | Описание |
|-------|------|----------|
| `POST` | `/promo-codes` | Создать промокод |
| `GET` | `/promo-codes` | Получить все промокоды |
| `GET` | `/promo-codes/:code` | Найти промокод по коду |
| `POST` | `/promo-codes/:code/activate` | Активировать промокод |

### Создание промокода (`POST /promo-codes`)

```json
{
  "code": "CODE",
  "discountPercent": 25,
  "activationLimit": 100,
  "expiresAt": "2036-12-31T00:00:00.000Z"
}
```

### Активация промокода (`POST /promo-codes/:code/activate`)

```json
{
  "email": "user@example.com"
}
```
