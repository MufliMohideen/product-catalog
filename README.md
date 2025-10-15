## Architecture Overview

## Project Structure

```
Product Catalog/
├── Backend/
│   ├── src/
│   │   ├── ProductCatalog.API/            # Web API controllers
│   │   ├── ProductCatalog.Application/    # Business logic, CQRS handlers
│   │   ├── ProductCatalog.Domain/         # Domain entities and interfaces
│   │   └── ProductCatalog.Infrastructure/ # Data access, repositories
│   └── ProductCatalog.sln                 # Solution file
├── client-app/                            # React frontend application
│   ├── src/
│   │   ├── components/                     # React components
│   │   ├── pages/                          # Page components
│   │   ├── services/                       # API service layer
│   │   ├── hooks/                          # Custom React hooks
│   │   └── types/                          # TypeScript interfaces
│   ├── package.json
│   └── vite.config.ts
└── README.md
```


## Getting Started

### Backend Setup

1. Navigate to the backend API directory:
   ```
   cd Backend/src/ProductCatalog.API
   ```

2. Restore NuGet packages:
   ```
   dotnet restore
   ```

3. Run the application:
   ```
   dotnet run
   ```

4. The API will be available at:
   - HTTP: http://localhost:5073
   - Swagger UI: http://localhost:5073/swagger

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd client-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. The application will be available at: http://localhost:5173

## API Endpoints

### Products
- GET /api/products - Retrieve all products
- GET /api/products/{id} - Retrieve a specific product
- POST /api/products - Create a new product
- PUT /api/products/{id} - Update an existing product
- DELETE /api/products/{id} - Delete a product
- GET /api/products/category/{category} - Get products by category
- GET /api/products/search?searchTerm={term} - Search products
- GET /api/products/active - Get active products only
