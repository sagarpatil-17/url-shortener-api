# URL Shortener Api

A lightweight and scalable URL shortener REST API built with **Node.js, Express.js, MongoDB, and Mongoose**. URL-Shortener converts long URLs into short, shareable links using randomly generated Nano ID codes and redirects users to their original destinations.

## Features

- **URL Shortening:** Generate unique short URLs using Nano ID.
- **Duplicate URL Detection:** Reuse an existing active short URL when the same original URL is submitted.
- **URL Redirection:** Redirect short links to their original destinations using HTTP 302.
- **Click Tracking:** Automatically increment the click count whenever a short URL is accessed.
- **Input Validation:** Validate URLs and accept only HTTP and HTTPS protocols.
- **Rate Limiting:** Protect URL creation and redirection endpoints against excessive requests.
- **MongoDB Integration:** Persist URL records using Mongoose.
- **Centralized Error Handling:** Consistent API error responses.
- **Security:** Use Helmet for HTTP security headers and CORS configuration.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB object modeling |
| Nano ID | Random short-code generation |
| Zod | Request validation |
| express-rate-limit | Rate limiting |
| Helmet | HTTP security headers |
| Morgan | HTTP request logging |
| CORS | Cross-origin resource sharing |
| dotenv | Environment configuration |

## Project Structure

```text
url-shortener-api/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── env.js
│   │
│   ├── modules/
│   │   ├── url/
│   │   │   ├── url.controller.js
│   │   │   ├── url.service.js
│   │   │   ├── url.routes.js
│   │   │   ├── url.model.js
│   │   │   └── url.validation.js
│   │   │
│   │   └── analytics/
│   │
│   ├── middlewares/
│   │   ├── error.middleware.js
│   │   ├── validate.middleware.js
│   │   └── rate-limit.middleware.js
│   │
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   └── asyncHandler.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js (LTS version recommended)
- npm
- MongoDB (local installation or MongoDB Atlas)
- Git

### 1. Clone the repository

```bash
git clone <your-repository-url>
```

Navigate into the project:

```bash
cd url-shortener-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=8080
NODE_ENV=development

MONGODB_URI=mongodb://127.0.0.1:27017/url-shortener

BASE_URL=http://localhost:8080
```

For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

### 4. Start the development server

```bash
npm run dev
```

Start the production server:

```bash
npm start
```

The API will be available at:

```text
http://localhost:8080
```

## API Documentation

### Base URL

```text
http://localhost:8080
```

### 1. Health Check

Check whether the API server is running.

**Endpoint:**

```http
GET /health
```

**Example Response:**

```json
{
  "success": true,
  "message": "url-shortener API is running",
  "timestamp": "2026-11-26T10:30:00.000Z"
}
```

### 2. Create a Short URL

Generate a short URL from an original URL.

**Endpoint:**

```http
POST /api/v1/urls
```

**Request Body:**

```json
{
  "originalUrl": "https://www.example.com"
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "Short URL created successfully",
  "data": {
    "id": "674abc1234567890abcdef12",
    "originalUrl": "https://www.example.com",
    "shortCode": "AbC123xy",
    "shortUrl": "http://localhost:8080/AbC123xy",
    "clicks": 0,
    "expiresAt": null,
    "createdAt": "2026-11-26T10:30:00.000Z"
  }
}
```

**Optional expiration date:**

```json
{
  "originalUrl": "https://www.example.com",
  "expiresAt": "2026-12-31T23:59:59.000Z"
}
```

Submitting an already existing active original URL returns its existing short URL instead of creating another one.

### 3. Redirect to Original URL

Redirect users to the original destination using the generated short code.

**Endpoint:**

```http
GET /:shortCode
```

**Example:**

```text
GET http://localhost:8080/AbC123xy
```

**Expected Behavior:**

- Returns HTTP `302 Found`.
- Redirects the user to the original URL.
- Increments the URL's click counter.

### 4. URL Analytics

Detailed analytics endpoints are planned for a future implementation.

## Rate Limiting

url-shortener uses `express-rate-limit` to protect its API from excessive requests.

| Endpoint | Request Limit | Time Window |
|---|---:|---|
| URL Creation | 10 requests | 15 minutes |
| URL Redirection | 300 requests | 15 minutes |

When a client exceeds the configured limit, the API responds with:

**HTTP Status:** `429 Too Many Requests`

```json
{
  "success": false,
  "message": "Too many URL creation requests. Please try again after 15 minutes."
}
```

These are initial per-IP limits and can be adjusted as traffic requirements evolve. Production deployments with multiple server instances should use a shared rate-limit store such as Redis.

## Error Handling

The API follows a consistent error response structure.

**Example:**

```json
{
  "success": false,
  "message": "Please provide a valid URL"
}
```

Common HTTP status codes:

| Status Code | Description |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 302 | Redirect |
| 400 | Bad request / validation error |
| 404 | Short URL not found |
| 429 | Too many requests |
| 500 | Internal server error |
| 503 | Service temporarily unavailable |

## Database Model

### URL Collection

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Unique document identifier |
| `originalUrl` | String | Original destination URL |
| `shortCode` | String | Randomly generated short code |
| `clicks` | Number | Total redirect count |
| `isActive` | Boolean | URL availability status |
| `createdAt` | Date | Record creation timestamp |
| `updatedAt` | Date | Last update timestamp |

### Indexes

- Unique index on `shortCode`.
- Index on `originalUrl` for duplicate URL lookup.
- Compound index on `isActive` and `createdAt` for efficient filtering and sorting.

## Security Considerations

- No authentication or user accounts are required.
- Only HTTP and HTTPS destination URLs are accepted.
- Request payloads are validated using Zod.
- Rate limiting helps prevent excessive API usage.
- Helmet adds commonly recommended HTTP security headers.
- Environment variables are used for sensitive configuration.

**Note:** URL-Shortener is currently a public URL-shortening service. It does not provide private URL ownership or authenticated URL management.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with Nodemon |
| `npm start` | Start production server |
| `npm test` | Run tests |

## Future Enhancements

- Detailed click analytics and click history.
- Daily, weekly, and monthly click statistics.
- Browser and device analytics.
- URL expiration and lifecycle management.
- Secure URL management capabilities.
- Redis-based caching and distributed rate limiting.
- Unit and integration testing.
- API documentation using Swagger / OpenAPI.
- Angular frontend integration.

## Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a pull request.

## License

This project is open-source and available under the MIT License.
