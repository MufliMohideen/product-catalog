using MediatR;
using ProductCatalog.Application.DTOs;

namespace ProductCatalog.Application.Queries;

/// <summary>
/// Query to get all products
/// Implements IRequest pattern from MediatR for CQRS
/// </summary>
public record GetAllProductsQuery : IRequest<IEnumerable<ProductDto>>;

/// <summary>
/// Query to get a product by ID
/// </summary>
public record GetProductByIdQuery(int Id) : IRequest<ProductDto?>;

/// <summary>
/// Query to get products by category
/// </summary>
public record GetProductsByCategoryQuery(string Category) : IRequest<IEnumerable<ProductDto>>;

/// <summary>
/// Query to search products by name or description
/// </summary>
public record SearchProductsQuery(string SearchTerm) : IRequest<IEnumerable<ProductDto>>;

/// <summary>
/// Query to get only active products
/// </summary>
public record GetActiveProductsQuery : IRequest<IEnumerable<ProductDto>>;