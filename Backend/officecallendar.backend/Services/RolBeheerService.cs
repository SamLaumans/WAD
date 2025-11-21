using Microsoft.EntityFrameworkCore;
using Officecalendar.Backend.Models;
using OfficeCalendar.Backend.DTOs;
using WADapi.Data;

public class UserService : IUserService
{
    private readonly AppDbContext _db;

    public UserService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<UserSearchDto>> GetAllUsersAsync()
    {
        return await _db.Users
            .Select(u => new UserSearchDto
            {
                Username = u.username,
                Email = u.email,
                Role = u.role
            })
            .ToListAsync();
    }

    public async Task<UserSearchDto?> ChangeUserRoleAsync(string username, int newRole)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.username == username);

        if (user == null)
            return null;

        user.role = newRole;
        await _db.SaveChangesAsync();

        return new UserSearchDto
        {
            Username = user.username,
            Email = user.email,
            Role = user.role
        };
    }
}
