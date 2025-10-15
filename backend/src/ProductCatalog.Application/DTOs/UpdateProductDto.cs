using System.ComponentModel.DataAnnotations;

namespace ProductCatalog.Application.DTOs;

/// <summary>
/// Data Transfer Object for updating an existing Product
/// </summary>
public class UpdateProductDto
{
    /// <summary>
    /// Product name (required)
    /// </summary>
    [Required(ErrorMessage = "Product name is required")]
    [StringLength(200, ErrorMessage = "Product name cannot exceed 200 characters")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Product description
    /// </summary>
    [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
    public string? Description { get; set; }

    /// <summary>
    /// Product price (required)
    /// </summary>
    [Required(ErrorMessage = "Price is required")]
    [Range(0, double.MaxValue, ErrorMessage = "Price must be greater than or equal to 0")]
    public decimal Price { get; set; }

    /// <summary>
    /// Stock quantity (required)
    /// </summary>
    [Required(ErrorMessage = "Stock quantity is required")]
    [Range(0, int.MaxValue, ErrorMessage = "Stock quantity must be greater than or equal to 0")]
    public int StockQuantity { get; set; }

    /// <summary>
    /// Product category
    /// </summary>
    [StringLength(100, ErrorMessage = "Category cannot exceed 100 characters")]
    public string? Category { get; set; }

    /// <summary>
    /// Product image URL
    /// </summary>
    [StringLength(500, ErrorMessage = "Image URL cannot exceed 500 characters")]
    [Url(ErrorMessage = "Please provide a valid URL")]
    public string? ImageUrl { get; set; }

    /// <summary>
    /// Stock Keeping Unit
    /// </summary>
    [StringLength(50, ErrorMessage = "SKU cannot exceed 50 characters")]
    public string? Sku { get; set; }

    /// <summary>
    /// Indicates if product is active
    /// </summary>
    public bool IsActive { get; set; }
}