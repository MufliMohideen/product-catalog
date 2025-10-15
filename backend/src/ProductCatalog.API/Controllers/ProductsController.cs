using MediatR;
using Microsoft.AspNetCore.Mvc;
using ProductCatalog.Application.Commands;
using ProductCatalog.Application.DTOs;
using ProductCatalog.Application.Queries;

namespace ProductCatalog.API.Controllers;

/// <summary>
/// RESTful API controller for product management operations.
/// Implements CQRS pattern using MediatR for command/query separation.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(IMediator mediator, ILogger<ProductsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Retrieves all products from the catalog.
    /// </summary>
    /// <returns>Collection of all available products.</returns>
    /// <response code="200">Successfully retrieved products collection.</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ProductDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetAllProducts()
    {
        try
        {
            _logger.LogInformation("Retrieving all products from catalog");
            var products = await _mediator.Send(new GetAllProductsQuery());
            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve products from catalog");
            return StatusCode(500, "An error occurred while processing your request");
        }
    }

    /// <summary>
    /// Retrieves a specific product by its unique identifier.
    /// </summary>
    /// <param name="id">The unique product identifier.</param>
    /// <returns>Product details if found.</returns>
    /// <response code="200">Successfully retrieved the product.</response>
    /// <response code="404">Product with specified ID was not found.</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        try
        {
            _logger.LogInformation("Retrieving product with ID: {ProductId}", id);
            var product = await _mediator.Send(new GetProductByIdQuery(id));
            
            if (product == null)
            {
                _logger.LogWarning("Product with ID {ProductId} not found", id);
                return NotFound($"Product with ID {id} not found");
            }

            return Ok(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve product with ID: {ProductId}", id);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }

    /// <summary>
    /// Retrieves all products within a specific category.
    /// </summary>
    /// <param name="category">The product category to filter by.</param>
    /// <returns>Collection of products matching the specified category.</returns>
    /// <response code="200">Successfully retrieved category products.</response>
    [HttpGet("category/{category}")]
    [ProducesResponseType(typeof(IEnumerable<ProductDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProductsByCategory(string category)
    {
        try
        {
            _logger.LogInformation("Retrieving products by category: {Category}", category);
            var products = await _mediator.Send(new GetProductsByCategoryQuery(category));
            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve products by category: {Category}", category);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }

    /// <summary>
    /// Searches products by name or description using the provided search term.
    /// </summary>
    /// <param name="searchTerm">The term to search for in product names and descriptions.</param>
    /// <returns>Collection of products matching the search criteria.</returns>
    /// <response code="200">Successfully retrieved search results.</response>
    /// <response code="400">Search term is empty or invalid.</response>
    [HttpGet("search")]
    [ProducesResponseType(typeof(IEnumerable<ProductDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<ProductDto>>> SearchProducts([FromQuery] string searchTerm)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return BadRequest("Search term cannot be empty");
            }

            _logger.LogInformation("Searching products with term: {SearchTerm}", searchTerm);
            var products = await _mediator.Send(new SearchProductsQuery(searchTerm));
            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to search products with term: {SearchTerm}", searchTerm);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }

    /// <summary>
    /// Retrieves only products that are currently active/available.
    /// </summary>
    /// <returns>Collection of active products only.</returns>
    /// <response code="200">Successfully retrieved active products.</response>
    [HttpGet("active")]
    [ProducesResponseType(typeof(IEnumerable<ProductDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetActiveProducts()
    {
        try
        {
            _logger.LogInformation("Retrieving active products from catalog");
            var products = await _mediator.Send(new GetActiveProductsQuery());
            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve active products");
            return StatusCode(500, "An error occurred while processing your request");
        }
    }

    /// <summary>
    /// Creates a new product in the catalog.
    /// </summary>
    /// <param name="createProductDto">Product creation data including name, description, price, and category.</param>
    /// <returns>The newly created product with assigned ID.</returns>
    /// <response code="201">Product successfully created.</response>
    /// <response code="400">Invalid product data provided.</response>
    [HttpPost]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductDto createProductDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _logger.LogInformation("Creating new product: {ProductName}", createProductDto.Name);
            var createdProduct = await _mediator.Send(new CreateProductCommand(createProductDto));
            
            return CreatedAtAction(
                nameof(GetProduct), 
                new { id = createdProduct.Id }, 
                createdProduct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create product: {ProductName}", createProductDto.Name);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }

    /// <summary>
    /// Updates an existing product with new information.
    /// </summary>
    /// <param name="id">The unique identifier of the product to update.</param>
    /// <param name="updateProductDto">Updated product data including name, description, price, and category.</param>
    /// <returns>The updated product information.</returns>
    /// <response code="200">Product successfully updated.</response>
    /// <response code="400">Invalid product data provided.</response>
    /// <response code="404">Product with specified ID was not found.</response>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductDto>> UpdateProduct(int id, [FromBody] UpdateProductDto updateProductDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _logger.LogInformation("Updating product with ID: {ProductId}", id);
            var updatedProduct = await _mediator.Send(new UpdateProductCommand(id, updateProductDto));
            
            return Ok(updatedProduct);
        }
        catch (KeyNotFoundException)
        {
            _logger.LogWarning("Product with ID {ProductId} not found for update", id);
            return NotFound($"Product with ID {id} not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update product with ID: {ProductId}", id);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }

    /// <summary>
    /// Permanently removes a product from the catalog.
    /// </summary>
    /// <param name="id">The unique identifier of the product to delete.</param>
    /// <returns>No content on successful deletion.</returns>
    /// <response code="204">Product successfully deleted.</response>
    /// <response code="404">Product with specified ID was not found.</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        try
        {
            _logger.LogInformation("Deleting product with ID: {ProductId}", id);
            var result = await _mediator.Send(new DeleteProductCommand(id));
            
            if (!result)
            {
                _logger.LogWarning("Product with ID {ProductId} not found for deletion", id);
                return NotFound($"Product with ID {id} not found");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete product with ID: {ProductId}", id);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }
}