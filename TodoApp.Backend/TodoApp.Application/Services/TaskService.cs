using AutoMapper;
using TodoApp.Application.DTOs.Tasks;
using TodoApp.Application.Interfaces;
using TodoApp.Domain.Entities;
using TodoApp.Domain.Interfaces;

namespace TodoApp.Application.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;
    private readonly IMapper _mapper;

    public TaskService(ITaskRepository taskRepository, IMapper mapper)
    {
        _taskRepository = taskRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<TaskDto>> GetAllTasksAsync(int userId, bool? isCompleted = null)
    {
        var tasks = await _taskRepository.GetAllByUserIdAsync(userId, isCompleted);
        return _mapper.Map<IEnumerable<TaskDto>>(tasks);
    }

    public async Task<TaskDto?> GetTaskByIdAsync(int id, int userId)
    {
        var task = await _taskRepository.GetByIdAsync(id);

        if (task == null || task.UserId != userId)
        {
            return null;
        }

        return _mapper.Map<TaskDto>(task);
    }

    public async Task<TaskDto> CreateTaskAsync(CreateTaskDto dto, int userId)
    {
        var task = new TaskEntity
        {
            Title = dto.Title,
            Description = dto.Description,
            UserId = userId,
            IsCompleted = false
        };

        var createdTask = await _taskRepository.AddAsync(task);
        return _mapper.Map<TaskDto>(createdTask);
    }

    public async Task<TaskDto?> UpdateTaskAsync(int id, UpdateTaskDto dto, int userId)
    {
        var task = await _taskRepository.GetByIdAsync(id);

        if (task == null || task.UserId != userId)
        {
            return null;
        }

        task.Title = dto.Title;
        task.Description = dto.Description;
        task.IsCompleted = dto.IsCompleted;

        await _taskRepository.UpdateAsync(task);
        return _mapper.Map<TaskDto>(task);
    }

    public async Task<bool> DeleteTaskAsync(int id, int userId)
    {
        var task = await _taskRepository.GetByIdAsync(id);

        if (task == null || task.UserId != userId)
        {
            return false;
        }

        await _taskRepository.DeleteAsync(id);
        return true;
    }

    public async Task<TaskDto?> ToggleTaskCompletionAsync(int id, int userId)
    {
        var task = await _taskRepository.GetByIdAsync(id);

        if (task == null || task.UserId != userId)
        {
            return null;
        }

        task.IsCompleted = !task.IsCompleted;
        await _taskRepository.UpdateAsync(task);

        return _mapper.Map<TaskDto>(task);
    }

    public async Task<TaskStatisticsDto> GetStatisticsAsync(int userId)
    {
        var total = await _taskRepository.CountByUserIdAsync(userId);
        var completed = await _taskRepository.CountCompletedByUserIdAsync(userId);
        var pending = await _taskRepository.CountPendingByUserIdAsync(userId);

        return new TaskStatisticsDto
        {
            TotalTasks = total,
            CompletedTasks = completed,
            PendingTasks = pending
        };
    }
}
