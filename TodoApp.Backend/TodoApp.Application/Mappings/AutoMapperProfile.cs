using AutoMapper;
using TodoApp.Application.DTOs.Tasks;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.Mappings;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<TaskEntity, TaskDto>();
        CreateMap<CreateTaskDto, TaskEntity>();
        CreateMap<UpdateTaskDto, TaskEntity>();
    }
}
