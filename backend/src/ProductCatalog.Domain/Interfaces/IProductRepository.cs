using ProductCatalog.Domain.Entities;

namespace ProductCatalog.Domain.Interfaces;

/// <summary>
/// Repository interface for Product entity operations
/// Follows the Repository pattern for data access abstraction
/// </summary>
public interface IProductRepository
{
    /// <summary>
    /// Gets all products asynchronously
    /// </summary>
    /// <returns>Collection of all products</returns>
    Task<IEnumerable<Product>> GetAllAsync();

    /// <summary>
    /// Gets a product by its ID asynchronously
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <returns>Product if found, null otherwise</returns>
    Task<Product?> GetByIdAsync(int id);

    /// <summary>
    /// Gets products by category asynchronously
    /// </summary>
    /// <param name="category">Product category</param>
    /// <returns>Collection of products in the specified category</returns>
    Task<IEnumerable<Product>> GetByCategoryAsync(string category);

    /// <summary>
    /// Searches products by name or description asynchronously
    /// </summary>
    /// <param name="searchTerm">Search term to match against name and description</param>
    /// <returns>Collection of matching products</returns>
    Task<IEnumerable<Product>> SearchAsync(string searchTerm);

    /// <summary>
    /// Adds a new product asynchronously
    /// </summary>
    /// <param name="product">Product to add</param>
    /// <returns>Added product with generated ID</returns>
    Task<Product> AddAsync(Product product);

    /// <summary>
    /// Updates an existing product asynchronously
    /// </summary>
    /// <param name="product">Product to update</param>
    /// <returns>Updated product</returns>
    Task<Product> UpdateAsync(Product product);

    /// <summary>
    /// Deletes a product by ID asynchronously
    /// </summary>
    /// <param name="id">Product ID to delete</param>
    /// <returns>True if deleted successfully, false otherwise</returns>
    Task<bool> DeleteAsync(int id);

    /// <summary>
    /// Checks if a product exists by ID asynchronously
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <returns>True if product exists, false otherwise</returns>
    Task<bool> ExistsAsync(int id);

    /// <summary>
    /// Gets active products only asynchronously
    /// </summary>
    /// <returns>Collection of active products</returns>
    Task<IEnumerable<Product>> GetActiveProductsAsync();
}