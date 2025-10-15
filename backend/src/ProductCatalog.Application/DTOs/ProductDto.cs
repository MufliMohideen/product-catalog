using System.ComponentModel.DataAnnotations;

namespace ProductCatalog.Application.DTOs;

/// <summary>
/// Data Transfer Object for Product - used for API responses
/// </summary>
public class ProductDto
{
    /// <summary>
    /// Product unique identifier
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Product name
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Product description
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Product price
    /// </summary>
    public decimal Price { get; set; }

    /// <summary>
    /// Available stock quantity
    /// </summary>
    public int StockQuantity { get; set; }

    /// <summary>
    /// Product category
    /// </summary>
    public string? Category { get; set; }

    /// <summary>
    /// Product image URL
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// Stock Keeping Unit
    /// </summary>
    public string? Sku { get; set; }

    /// <summary>
    /// Indicates if product is active
    /// </summary>
    public bool IsActive { get; set; }

    /// <summary>
    /// Creation timestamp
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Last update timestamp
    /// </summary>
    public DateTime UpdatedAt { get; set; }
}