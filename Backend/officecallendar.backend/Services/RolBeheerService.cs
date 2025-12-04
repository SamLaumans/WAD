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

    public async Task<List<UserSearchDto>> SearchUsersByUsernameAsync(string query)
    {
        return await _db.Users
            .Where(u => u.username.Contains(query)) //zoekt gebruikers op basis van een string zoekt op username
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
        var user = await _db.Users.FirstOrDefaultAsync(u => u.username == username);  //zoekt naar gebruikers door username

        if (user == null)
            return null;

        user.role = newRole;    //geeft gebruiker nieuwe rol
        await _db.SaveChangesAsync(); //slaat op

        return new UserSearchDto
        {
            Username = user.username,
            Email = user.email,
            Role = user.role
        };
    }
}
