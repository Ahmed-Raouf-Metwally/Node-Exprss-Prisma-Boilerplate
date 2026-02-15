# Node.js Express Prisma Boilerplate

🚀 **Enterprise-grade Node.js REST API boilerplate** with Express, Prisma ORM, MySQL, Redis, and comprehensive tooling.

## ✨ Features

- **🔒 Security**: Helmet, CORS, XSS protection, HPP, rate limiting
- **🗄️ Database**: Prisma ORM with MySQL
- **⚡ Cache**: Redis integration for high performance
- **🔐 Authentication**: JWT-based auth with role-based access control
- **📧 Email**: Nodemailer integration with templates
- **💳 Payments**: Stripe integration
- **📁 File Upload**: Multer with UUID-based naming
- **📝 Validation**: Express-validator
- **🪵 Logging**: Winston + Morgan (file + console)
- **🐳 Docker**: Full Docker Compose setup with MySQL & Redis
- **✅ Testing**: Jest + Supertest configured
- **🎨 Code Quality**: ESLint (Airbnb) + Prettier + Husky pre-commit hooks
- **📊 Standardized Responses**: Consistent API response structure

## 📦 Tech Stack

- **Runtime**: Node.js (>= 18.x)
- **Framework**: Express 4.x
- **Database**: MySQL 8.0 with Prisma ORM
- **Cache**: Redis 7.x
- **Auth**: JWT + bcrypt
- **Testing**: Jest + Supertest
- **Code Quality**: ESLint + Prettier

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.x
- Docker & Docker Compose (for containerized setup)
- MySQL 8.0 (if running locally)
- Redis (if running locally)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Node-Exprss-Prisma-Boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

5. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:5000`

## 🐳 Docker Setup (Recommended)

1. **Create .env file**
   ```bash
   cp .env.example .env
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Run migrations**
   ```bash
   docker-compose exec app npx prisma migrate dev
   ```

4. **View logs**
   ```bash
   docker-compose logs -f app
   ```

## 📁 Project Structure

```
/root
├── /src
│   ├── /config         # Configuration files (db, etc.)
│   ├── /controllers    # Request handlers
│   ├── /middlewares    # Custom middlewares (auth, validation, etc.)
│   ├── /routes         # API route definitions
│   ├── /services       # Business logic (email, payment, cache)
│   ├── /utils          # Utility functions (logger, errors, responses)
│   ├── /validators     # Request validation schemas
│   └── app.js          # Express app setup
├── /prisma
│   └── schema.prisma   # Database schema
├── /__tests__          # Test files
├── /logs               # Application logs
├── /uploads            # Uploaded files
├── .env.example        # Environment variables template
├── docker-compose.yml  # Docker orchestration
├── Dockerfile          # Docker image definition
└── server.js           # Application entry point
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with nodemon |
| `npm test` | Run tests with coverage |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Check code with ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio |

## 📘 API Documentation

### Health Check
```http
GET /api/status
```

Response:
```json
{
  "success": true,
  "code": 200,
  "message": "Server is running",
  "data": {
    "status": "healthy",
    "environment": "development",
    "timestamp": "2026-02-16T01:30:00.000Z"
  }
}
```

## 🔐 Environment Variables

See `.env.example` for all available configuration options:

- **Application**: `NODE_ENV`, `PORT`, `APP_NAME`
- **Database**: `DATABASE_URL`
- **Redis**: `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- **JWT**: `JWT_SECRET`, `JWT_EXPIRES_IN`
- **Email**: `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`
- **Stripe**: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`
- **CORS**: `CORS_ORIGIN`
- **Rate Limiting**: `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📝 Code Quality

This project uses:
- **ESLint** with Airbnb style guide
- **Prettier** for code formatting
- **Husky** for pre-commit hooks

Lint your code:
```bash
npm run lint
```

Auto-fix issues:
```bash
npm run lint:fix
```

Format code:
```bash
npm run format
```

## 🛡️ Security Features

- **Helmet**: Sets security-related HTTP headers
- **CORS**: Configurable cross-origin resource sharing
- **XSS-Clean**: Prevents cross-site scripting attacks
- **HPP**: Protects against HTTP parameter pollution
- **Rate Limiting**: Prevents brute-force attacks
- **JWT Authentication**: Secure token-based auth
- **bcrypt**: Password hashing

## 📚 Key Services

### Email Service
```javascript
const emailService = require('./src/services/emailService');

await emailService.sendWelcomeEmail(user);
await emailService.sendPasswordResetEmail(user, token);
```

### Payment Service
```javascript
const paymentService = require('./src/services/paymentService');

const paymentIntent = await paymentService.createPaymentIntent(1000, 'usd');
```

### Cache Service
```javascript
const cacheService = require('./src/services/cacheService');

await cacheService.set('key', { data: 'value' }, 3600);
const data = await cacheService.get('key');
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Support

If you find this boilerplate helpful, please ⭐ star the repository!

---

**Built with ❤️ for the Node.js community**
