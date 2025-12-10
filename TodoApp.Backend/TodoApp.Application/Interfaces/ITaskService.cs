using TodoApp.Application.DTOs.Tasks;

namespace TodoApp.Application.Interfaces;

public interface ITaskService
{
    Task<IEnumerable<TaskDto>> GetAllTasksAsync(int userId, bool? isCompleted = null);
    Task<TaskDto?> GetTaskByIdAsync(int id, int userId);
    Task<TaskDto> CreateTaskAsync(CreateTaskDto dto, int userId);
    Task<TaskDto?> UpdateTaskAsync(int id, UpdateTaskDto dto, int userId);
    Task<bool> DeleteTaskAsync(int id, int userId);
    Task<TaskDto?> ToggleTaskCompletionAsync(int id, int userId);
    Task<TaskStatisticsDto> GetStatisticsAsync(int userId);
}
