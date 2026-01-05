using OfficeCalendar.Backend.DTOs;
using WADapi.Data;
using Microsoft.EntityFrameworkCore;
using Officecalendar.Backend.Models;
using BCrypt.Net;

namespace OfficeCalendar.Backend.Services;

public class AuthService
{
    private readonly AppDbContext _context;

    public AuthService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<LoginResponseDto> Login(LoginPostDto request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.username == request.username);

        if (user == null)
            return new LoginResponseDto { success = false, message = "Invalid username or password" };

        bool isPasswordCorrect = BCrypt.Net.BCrypt.Verify(request.password, user.password);

        if (!isPasswordCorrect)
            return new LoginResponseDto { success = false, message = "Invalid username or password" };

        return new LoginResponseDto { success = true, username = user.username, role = user.role };
    }

    public async Task<RegisterResponseDto> Register(RegisterPostDto request)
    {
        if (await _context.Users.AnyAsync(u => u.username == request.username))
            return new RegisterResponseDto { success = false, message = "Username taken" };

        var user = new User
        {
            username = request.username,
            email = request.email,
            password = BCrypt.Net.BCrypt.HashPassword(request.password),
            nickname = request.nickname ?? request.username,
            creation_date = DateTime.UtcNow,
            role = 0
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new RegisterResponseDto { success = true, username = user.username, role = user.role };
    }

    public async Task<User> GetUserByUsername(string username)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.username == username);
    }
}
