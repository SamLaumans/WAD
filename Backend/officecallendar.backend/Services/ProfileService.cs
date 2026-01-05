using OfficeCalendar.Backend.DTOs;
using Microsoft.EntityFrameworkCore;
using WADapi.Data;

public class ProfileService : IProfileService
{
    private readonly AppDbContext _context;

    public ProfileService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UserGetDto?> GetUserByUsernameAsync(string username)
    {
        return await _context.Users
            .Where(u => u.username == username)
            .Select(u => new UserGetDto
            {

                username = u.username,
                email = u.email,
                nickname = u.nickname,
                creation_date = u.creation_date,
                role = u.role
            })
            .FirstOrDefaultAsync();
    }
}