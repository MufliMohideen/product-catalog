using System.ComponentModel.DataAnnotations;

namespace ProductCatalog.Domain.Entities;

/// <summary>
/// Product entity representing a product in the catalog
/// </summary>
public class Product
{
    /// <summary>
    /// Unique identifier for the product
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Product name
    /// </summary>
    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Product description
    /// </summary>
    [StringLength(1000)]
    public string? Description { get; set; }

    /// <summary>
    /// Product price
    /// </summary>
    [Required]
    [Range(0, double.MaxValue, ErrorMessage = "Price must be greater than or equal to 0")]
    public decimal Price { get; set; }

    /// <summary>
    /// Stock quantity available
    /// </summary>
    [Required]
    [Range(0, int.MaxValue, ErrorMessage = "Stock quantity must be greater than or equal to 0")]
    public int StockQuantity { get; set; }

    /// <summary>
    /// Product category
    /// </summary>
    [StringLength(100)]
    public string? Category { get; set; }

    /// <summary>
    /// Product image URL
    /// </summary>
    [StringLength(500)]
    public string? ImageUrl { get; set; }

    /// <summary>
    /// SKU (Stock Keeping Unit) - unique product identifier
    /// </summary>
    [StringLength(50)]
    public string? Sku { get; set; }

    /// <summary>
    /// Indicates if the product is currently active/available
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Date when the product was created
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Date when the product was last updated
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}