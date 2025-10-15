using MediatR;
using ProductCatalog.Application.DTOs;

namespace ProductCatalog.Application.Commands;

/// <summary>
/// Command to create a new product
/// </summary>
public record CreateProductCommand(CreateProductDto Product) : IRequest<ProductDto>;

/// <summary>
/// Command to update an existing product
/// </summary>
public record UpdateProductCommand(int Id, UpdateProductDto Product) : IRequest<ProductDto>;

/// <summary>
/// Command to delete a product by ID
/// </summary>
public record DeleteProductCommand(int Id) : IRequest<bool>;