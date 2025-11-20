using Officecalendar.Backend.Models;
using OfficeCalendar.Backend.DTOs;

namespace OfficeCalendar.Backend.Services;

public class AuthService
{
    private readonly List<User> _users = new()
    {
        new User { username = "admin", email = "hoi@hotmail.com", nickname = "Mex", creation_date = DateTime.Now, role = 1, password = "password123"},
        new User { username = "user1", email = "hoi2@hotmail.com", nickname = "Job", creation_date = DateTime.Now, role = 0, password = "password456"},
    };

    public LoginResponse Login(LoginRequest request)
    {
        var user = _users.FirstOrDefault(u => u.username == request.Username);

        if (user == null || user.password != request.Password)
        {
            return new LoginResponse { Success = false, Message = "Invalid username or password" };
        }

        var role = user.username == "admin" ? "Admin" : "Employee";

        return new LoginResponse
        {
            Success = true,
            Message = "Login successful",
            Role = role
        };
    }
}
