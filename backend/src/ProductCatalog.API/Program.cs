using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using ProductCatalog.Application.Mappings;
using ProductCatalog.Domain.Interfaces;
using ProductCatalog.Infrastructure.Data;
using ProductCatalog.Infrastructure.Repositories;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Configure dependency injection and application services
ConfigureServices(builder.Services, builder.Configuration);

var app = builder.Build();

// Configure middleware pipeline for request processing
ConfigurePipeline(app);

app.Run();

/// <summary>
/// Configures application services and dependency injection container.
/// </summary>
/// <param name="services">The service collection to configure.</param>
/// <param name="configuration">Application configuration settings.</param>

static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
{
    // Configure Entity Framework Core with SQLite database provider
    services.AddDbContext<ProductCatalogDbContext>(options =>
        options.UseSqlite(configuration.GetConnectionString("DefaultConnection") 
            ?? "Data Source=productcatalog.db"));

    // Register repository pattern implementations for data access
    services.AddScoped<IProductRepository, ProductRepository>();
    services.AddScoped<IUnitOfWork, UnitOfWork>();

    // Configure MediatR for implementing CQRS pattern
    services.AddMediatR(cfg => 
        cfg.RegisterServicesFromAssembly(typeof(ProductCatalog.Application.Commands.CreateProductCommand).Assembly));

    // Register AutoMapper for object-to-object mapping
    services.AddAutoMapper(typeof(ProductMappingProfile));

    // Register Web API controllers for HTTP endpoints
    services.AddControllers();

    // Enable API Explorer services for Swagger documentation
    services.AddEndpointsApiExplorer();

    // Configure Swagger/OpenAPI documentation generation
    services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo
        {
            Version = "v1",
            Title = "Product Catalog API",
            Description = "A comprehensive Product Catalog API built with Clean Architecture and CQRS pattern",
            Contact = new OpenApiContact
            {
                Name = "Product Catalog Team",
                Email = "support@productcatalog.com"
            }
        });

        // Enable XML documentation comments in Swagger UI
        var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
        var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
        if (File.Exists(xmlPath))
        {
            c.IncludeXmlComments(xmlPath);
        }
    });

    // Configure Cross-Origin Resource Sharing for frontend integration
    services.AddCors(options =>
    {
        options.AddPolicy("AllowReactApp", policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
    });

    // Configure application logging services
    services.AddLogging();
}

/// <summary>
/// Configures the HTTP request pipeline and middleware components.
/// </summary>
/// <param name="app">The web application instance to configure.</param>
static void ConfigurePipeline(WebApplication app)
{
    // Configure development-specific middleware and services
    if (app.Environment.IsDevelopment())
    {
        // Enable Swagger documentation in development environment
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Product Catalog API v1");
            c.RoutePrefix = "swagger";
            c.DocumentTitle = "Product Catalog API Documentation";
        });

        // Initialize database schema for development environment
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ProductCatalogDbContext>();
        context.Database.EnsureCreated();
    }

    // Configure HTTPS redirection for secure communication
    app.UseHttpsRedirection();

    // Apply CORS policy for cross-origin requests
    app.UseCors("AllowReactApp");

    // Configure authorization middleware (prepared for future authentication)
    app.UseAuthorization();

    // Map controller endpoints to handle HTTP requests
    app.MapControllers();

    // Configure health check endpoint for application monitoring
    app.MapGet("/health", () => Results.Ok(new { Status = "Healthy", Timestamp = DateTime.UtcNow }))
       .WithTags("Health")
       .WithOpenApi();
}
