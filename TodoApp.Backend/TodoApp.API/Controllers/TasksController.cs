using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoApp.Application.DTOs.Tasks;
using TodoApp.Application.Interfaces;

namespace TodoApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;
    private readonly ILogger<TasksController> _logger;

    public TasksController(ITaskService taskService, ILogger<TasksController> logger)
    {
        _taskService = taskService;
        _logger = logger;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim!);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool? isCompleted = null)
    {
        try
        {
            var userId = GetUserId();
            var tasks = await _taskService.GetAllTasksAsync(userId, isCompleted);
            return Ok(tasks);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting tasks");
            return StatusCode(500, new { message = "Error al obtener las tareas" });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var userId = GetUserId();
            var task = await _taskService.GetTaskByIdAsync(id, userId);

            if (task == null)
            {
                return NotFound(new { message = "Tarea no encontrada" });
            }

            return Ok(task);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting task with id: {TaskId}", id);
            return StatusCode(500, new { message = "Error al obtener la tarea" });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTaskDto dto)
    {
        try
        {
            var userId = GetUserId();
            var task = await _taskService.CreateTaskAsync(dto, userId);
            return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating task");
            return StatusCode(500, new { message = "Error al crear la tarea" });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTaskDto dto)
    {
        try
        {
            var userId = GetUserId();
            var task = await _taskService.UpdateTaskAsync(id, dto, userId);

            if (task == null)
            {
                return NotFound(new { message = "Tarea no encontrada" });
            }

            return Ok(task);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating task with id: {TaskId}", id);
            return StatusCode(500, new { message = "Error al actualizar la tarea" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var userId = GetUserId();
            var result = await _taskService.DeleteTaskAsync(id, userId);

            if (!result)
            {
                return NotFound(new { message = "Tarea no encontrada" });
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting task with id: {TaskId}", id);
            return StatusCode(500, new { message = "Error al eliminar la tarea" });
        }
    }

    [HttpPatch("{id}/toggle")]
    public async Task<IActionResult> ToggleCompletion(int id)
    {
        try
        {
            var userId = GetUserId();
            var task = await _taskService.ToggleTaskCompletionAsync(id, userId);

            if (task == null)
            {
                return NotFound(new { message = "Tarea no encontrada" });
            }

            return Ok(task);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling task completion with id: {TaskId}", id);
            return StatusCode(500, new { message = "Error al cambiar el estado de la tarea" });
        }
    }

    [HttpGet("statistics")]
    public async Task<IActionResult> GetStatistics()
    {
        try
        {
            var userId = GetUserId();
            var statistics = await _taskService.GetStatisticsAsync(userId);
            return Ok(statistics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting statistics");
            return StatusCode(500, new { message = "Error al obtener las estadísticas" });
        }
    }
}
