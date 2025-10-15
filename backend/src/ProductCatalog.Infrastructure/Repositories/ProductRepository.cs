using Microsoft.EntityFrameworkCore;
using ProductCatalog.Domain.Entities;
using ProductCatalog.Domain.Interfaces;
using ProductCatalog.Infrastructure.Data;

namespace ProductCatalog.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for Product entity using Entity Framework Core
/// Implements the Repository pattern for data access abstraction
/// </summary>
public class ProductRepository : IProductRepository
{
    private readonly ProductCatalogDbContext _context;

    public ProductRepository(ProductCatalogDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Gets all products asynchronously
    /// </summary>
    /// <returns>Collection of all products</returns>
    public async Task<IEnumerable<Product>> GetAllAsync()
    {
        return await _context.Products.ToListAsync();
    }

    /// <summary>
    /// Gets a product by its ID asynchronously
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <returns>Product if found, null otherwise</returns>
    public async Task<Product?> GetByIdAsync(int id)
    {
        return await _context.Products.FindAsync(id);
    }

    /// <summary>
    /// Gets products by category asynchronously
    /// </summary>
    /// <param name="category">Product category</param>
    /// <returns>Collection of products in the specified category</returns>
    public async Task<IEnumerable<Product>> GetByCategoryAsync(string category)
    {
        return await _context.Products
            .Where(p => p.Category != null && p.Category.ToLower() == category.ToLower())
            .ToListAsync();
    }

    /// <summary>
    /// Searches products by name or description asynchronously
    /// </summary>
    /// <param name="searchTerm">Search term to match against name and description</param>
    /// <returns>Collection of matching products</returns>
    public async Task<IEnumerable<Product>> SearchAsync(string searchTerm)
    {
        var lowerSearchTerm = searchTerm.ToLower();
        return await _context.Products
            .Where(p => p.Name.ToLower().Contains(lowerSearchTerm) ||
                       (p.Description != null && p.Description.ToLower().Contains(lowerSearchTerm)))
            .ToListAsync();
    }

    /// <summary>
    /// Adds a new product asynchronously
    /// </summary>
    /// <param name="product">Product to add</param>
    /// <returns>Added product with generated ID</returns>
    public Task<Product> AddAsync(Product product)
    {
        product.CreatedAt = DateTime.UtcNow;
        product.UpdatedAt = DateTime.UtcNow;
        
        _context.Products.Add(product);
        return Task.FromResult(product);
    }

    /// <summary>
    /// Updates an existing product asynchronously
    /// </summary>
    /// <param name="product">Product to update</param>
    /// <returns>Updated product</returns>
    public Task<Product> UpdateAsync(Product product)
    {
        product.UpdatedAt = DateTime.UtcNow;
        
        _context.Products.Update(product);
        return Task.FromResult(product);
    }

    /// <summary>
    /// Deletes a product by ID asynchronously
    /// </summary>
    /// <param name="id">Product ID to delete</param>
    /// <returns>True if deleted successfully, false otherwise</returns>
    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return false;
        }

        _context.Products.Remove(product);
        return true;
    }

    /// <summary>
    /// Checks if a product exists by ID asynchronously
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <returns>True if product exists, false otherwise</returns>
    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Products.AnyAsync(p => p.Id == id);
    }

    /// <summary>
    /// Gets active products only asynchronously
    /// </summary>
    /// <returns>Collection of active products</returns>
    public async Task<IEnumerable<Product>> GetActiveProductsAsync()
    {
        return await _context.Products
            .Where(p => p.IsActive)
            .ToListAsync();
    }
}