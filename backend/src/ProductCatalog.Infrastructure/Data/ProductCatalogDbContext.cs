using Microsoft.EntityFrameworkCore;
using ProductCatalog.Domain.Entities;

namespace ProductCatalog.Infrastructure.Data;

/// <summary>
/// Entity Framework DbContext for Product Catalog application
/// Manages database connection and entity configurations for SQLite database
/// </summary>
public class ProductCatalogDbContext : DbContext
{
    public ProductCatalogDbContext(DbContextOptions<ProductCatalogDbContext> options) : base(options)
    {
    }

    /// <summary>
    /// Products DbSet for database operations
    /// </summary>
    public DbSet<Product> Products { get; set; }

    /// <summary>
    /// Configures entity relationships and constraints
    /// </summary>
    /// <param name="modelBuilder">Entity Framework model builder</param>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Product entity
        modelBuilder.Entity<Product>(entity =>
        {
            // Primary key
            entity.HasKey(p => p.Id);

            // Configure properties
            entity.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(p => p.Description)
                .HasMaxLength(1000);

            entity.Property(p => p.Price)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            entity.Property(p => p.StockQuantity)
                .IsRequired();

            entity.Property(p => p.Category)
                .HasMaxLength(100);

            entity.Property(p => p.ImageUrl)
                .HasMaxLength(500);

            entity.Property(p => p.Sku)
                .HasMaxLength(50);

            entity.Property(p => p.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            entity.Property(p => p.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("datetime('now')");

            entity.Property(p => p.UpdatedAt)
                .IsRequired()
                .HasDefaultValueSql("datetime('now')");

            // Indexes for better query performance
            entity.HasIndex(p => p.Name);
            entity.HasIndex(p => p.Category);
            entity.HasIndex(p => p.Sku);
            entity.HasIndex(p => p.IsActive);
        });

        // Seed data for demonstration
        SeedData(modelBuilder);
    }

    /// <summary>
    /// Seeds initial data for demonstration purposes
    /// </summary>
    /// <param name="modelBuilder">Entity Framework model builder</param>
    private static void SeedData(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>().HasData(
            new Product
            {
                Id = 1,
                Name = "Laptop Computer",
                Description = "High-performance laptop for professional use",
                Price = 999.99m,
                StockQuantity = 10,
                Category = "Electronics",
                Sku = "LAP001",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Product
            {
                Id = 2,
                Name = "Wireless Mouse",
                Description = "Ergonomic wireless mouse with long battery life",
                Price = 29.99m,
                StockQuantity = 50,
                Category = "Electronics",
                Sku = "MSE001",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Product
            {
                Id = 3,
                Name = "Office Chair",
                Description = "Comfortable ergonomic office chair",
                Price = 199.99m,
                StockQuantity = 25,
                Category = "Furniture",
                Sku = "CHR001",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        );
    }
}