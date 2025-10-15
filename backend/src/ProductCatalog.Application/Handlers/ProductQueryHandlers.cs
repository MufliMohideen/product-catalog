using AutoMapper;
using MediatR;
using ProductCatalog.Application.DTOs;
using ProductCatalog.Application.Queries;
using ProductCatalog.Domain.Interfaces;

namespace ProductCatalog.Application.Handlers;

/// <summary>
/// Handler for Get All Products Query
/// Implements CQRS pattern using MediatR
/// </summary>
public class GetAllProductsQueryHandler : IRequestHandler<GetAllProductsQuery, IEnumerable<ProductDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetAllProductsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProductDto>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
    {
        var products = await _unitOfWork.Products.GetAllAsync();
        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }
}

/// <summary>
/// Handler for Get Product By ID Query
/// </summary>
public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDto?>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetProductByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ProductDto?> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(request.Id);
        return product != null ? _mapper.Map<ProductDto>(product) : null;
    }
}

/// <summary>
/// Handler for Get Products By Category Query
/// </summary>
public class GetProductsByCategoryQueryHandler : IRequestHandler<GetProductsByCategoryQuery, IEnumerable<ProductDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetProductsByCategoryQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProductDto>> Handle(GetProductsByCategoryQuery request, CancellationToken cancellationToken)
    {
        var products = await _unitOfWork.Products.GetByCategoryAsync(request.Category);
        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }
}

/// <summary>
/// Handler for Search Products Query
/// </summary>
public class SearchProductsQueryHandler : IRequestHandler<SearchProductsQuery, IEnumerable<ProductDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public SearchProductsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProductDto>> Handle(SearchProductsQuery request, CancellationToken cancellationToken)
    {
        var products = await _unitOfWork.Products.SearchAsync(request.SearchTerm);
        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }
}

/// <summary>
/// Handler for Get Active Products Query
/// </summary>
public class GetActiveProductsQueryHandler : IRequestHandler<GetActiveProductsQuery, IEnumerable<ProductDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetActiveProductsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProductDto>> Handle(GetActiveProductsQuery request, CancellationToken cancellationToken)
    {
        var products = await _unitOfWork.Products.GetActiveProductsAsync();
        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }
}