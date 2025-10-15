namespace ProductCatalog.Domain.Interfaces;

/// <summary>
/// Unit of Work interface for managing database transactions
/// Ensures that multiple repository operations can be executed in a single transaction
/// </summary>
public interface IUnitOfWork : IDisposable
{
    /// <summary>
    /// Product repository instance
    /// </summary>
    IProductRepository Products { get; }

    /// <summary>
    /// Saves all changes made in this unit of work to the underlying data store
    /// </summary>
    /// <returns>Number of objects written to the underlying data store</returns>
    Task<int> SaveChangesAsync();

    /// <summary>
    /// Begins a database transaction
    /// </summary>
    /// <returns>Task representing the asynchronous operation</returns>
    Task BeginTransactionAsync();

    /// <summary>
    /// Commits the current transaction
    /// </summary>
    /// <returns>Task representing the asynchronous operation</returns>
    Task CommitTransactionAsync();

    /// <summary>
    /// Rolls back the current transaction
    /// </summary>
    /// <returns>Task representing the asynchronous operation</returns>
    Task RollbackTransactionAsync();
}