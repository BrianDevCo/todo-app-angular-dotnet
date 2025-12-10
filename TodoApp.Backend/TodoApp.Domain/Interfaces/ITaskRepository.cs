using TodoApp.Domain.Entities;

namespace TodoApp.Domain.Interfaces;

public interface ITaskRepository
{
    Task<IEnumerable<TaskEntity>> GetAllByUserIdAsync(int userId, bool? isCompleted = null);
    Task<TaskEntity?> GetByIdAsync(int id);
    Task<TaskEntity> AddAsync(TaskEntity task);
    Task UpdateAsync(TaskEntity task);
    Task DeleteAsync(int id);
    Task<int> CountByUserIdAsync(int userId);
    Task<int> CountCompletedByUserIdAsync(int userId);
    Task<int> CountPendingByUserIdAsync(int userId);
}
