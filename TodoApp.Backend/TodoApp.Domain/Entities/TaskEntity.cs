using TodoApp.Domain.Common;

namespace TodoApp.Domain.Entities;

public class TaskEntity : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsCompleted { get; set; } = false;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
}
