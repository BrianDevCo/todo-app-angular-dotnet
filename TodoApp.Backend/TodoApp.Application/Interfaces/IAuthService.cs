using TodoApp.Application.DTOs.Auth;

namespace TodoApp.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);
}
