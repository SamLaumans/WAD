using Officecalendar.Backend.Models;
using OfficeCalendar.Backend.DTOs;

namespace OfficeCalendar.Backend.Services;

public class AuthService
{
    private readonly List<User> _users = new()
    {
        new User { id = 1, name = "admin", password = "password123"},
        new User { id = 2, name = "employee", password = "password123" }
    };

    public LoginResponse Login(LoginRequest request)
    {
        var user = _users.FirstOrDefault(u => u.name == request.Username);

        if (user == null || user.password != request.Password)
        {
            return new LoginResponse { Success = false, Message = "Invalid username or password" };
        }

        var role = user.name == "admin" ? "Admin" : "Employee";

        return new LoginResponse
        {
            Success = true,
            Message = "Login successful",
            Role = role
        };
    }
}
