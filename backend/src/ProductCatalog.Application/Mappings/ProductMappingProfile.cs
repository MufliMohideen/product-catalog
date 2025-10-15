using AutoMapper;
using ProductCatalog.Application.DTOs;
using ProductCatalog.Domain.Entities;

namespace ProductCatalog.Application.Mappings;

/// <summary>
/// AutoMapper profile for mapping between domain entities and DTOs
/// This ensures separation between domain models and API contracts
/// </summary>
public class ProductMappingProfile : Profile
{
    public ProductMappingProfile()
    {
        // Map from Product entity to ProductDto
        CreateMap<Product, ProductDto>();

        // Map from CreateProductDto to Product entity
        CreateMap<CreateProductDto, Product>()
            .ForMember(dest => dest.Id, opt => opt.Ignore()) // ID is auto-generated
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

        // Map from UpdateProductDto to Product entity
        CreateMap<UpdateProductDto, Product>()
            .ForMember(dest => dest.Id, opt => opt.Ignore()) // ID should not be updated
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore()) // CreatedAt should not be updated
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));
    }
}