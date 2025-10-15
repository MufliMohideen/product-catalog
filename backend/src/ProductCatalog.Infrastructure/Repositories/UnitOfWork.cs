using Microsoft.EntityFrameworkCore.Storage;
using ProductCatalog.Domain.Interfaces;
using ProductCatalog.Infrastructure.Data;

namespace ProductCatalog.Infrastructure.Repositories;

/// <summary>
/// Unit of Work implementation using Entity Framework Core
/// Manages database transactions and provides access to repositories
/// </summary>
public class UnitOfWork : IUnitOfWork
{
    private readonly ProductCatalogDbContext _context;
    private IDbContextTransaction? _transaction;
    private IProductRepository? _products;

    public UnitOfWork(ProductCatalogDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Product repository instance (lazy initialization)
    /// </summary>
    public IProductRepository Products => _products ??= new ProductRepository(_context);

    /// <summary>
    /// Saves all changes made in this unit of work to the underlying data store
    /// </summary>
    /// <returns>Number of objects written to the underlying data store</returns>
    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Begins a database transaction
    /// </summary>
    /// <returns>Task representing the asynchronous operation</returns>
    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    /// <summary>
    /// Commits the current transaction
    /// </summary>
    /// <returns>Task representing the asynchronous operation</returns>
    public async Task CommitTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    /// <summary>
    /// Rolls back the current transaction
    /// </summary>
    /// <returns>Task representing the asynchronous operation</returns>
    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    /// <summary>
    /// Disposes the Unit of Work and its resources
    /// </summary>
    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}