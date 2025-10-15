using AutoMapper;
using MediatR;
using ProductCatalog.Application.Commands;
using ProductCatalog.Application.DTOs;
using ProductCatalog.Domain.Entities;
using ProductCatalog.Domain.Interfaces;

namespace ProductCatalog.Application.Handlers;

/// <summary>
/// Handler for Create Product Command
/// Implements CQRS pattern using MediatR
/// </summary>
public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, ProductDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateProductCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ProductDto> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        // Map DTO to domain entity
        var product = _mapper.Map<Product>(request.Product);

        // Add product to repository
        var createdProduct = await _unitOfWork.Products.AddAsync(product);
        
        // Save changes
        await _unitOfWork.SaveChangesAsync();

        // Map back to DTO and return
        return _mapper.Map<ProductDto>(createdProduct);
    }
}

/// <summary>
/// Handler for Update Product Command
/// </summary>
public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, ProductDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateProductCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ProductDto> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        // Get existing product
        var existingProduct = await _unitOfWork.Products.GetByIdAsync(request.Id);
        if (existingProduct == null)
        {
            throw new KeyNotFoundException($"Product with ID {request.Id} not found");
        }

        // Map updated values to existing product
        _mapper.Map(request.Product, existingProduct);
        existingProduct.Id = request.Id; // Ensure ID is preserved

        // Update product
        var updatedProduct = await _unitOfWork.Products.UpdateAsync(existingProduct);
        
        // Save changes
        await _unitOfWork.SaveChangesAsync();

        // Map back to DTO and return
        return _mapper.Map<ProductDto>(updatedProduct);
    }
}

/// <summary>
/// Handler for Delete Product Command
/// </summary>
public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteProductCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        // Check if product exists
        var productExists = await _unitOfWork.Products.ExistsAsync(request.Id);
        if (!productExists)
        {
            return false;
        }

        // Delete product
        var result = await _unitOfWork.Products.DeleteAsync(request.Id);
        
        // Save changes
        if (result)
        {
            await _unitOfWork.SaveChangesAsync();
        }

        return result;
    }
}