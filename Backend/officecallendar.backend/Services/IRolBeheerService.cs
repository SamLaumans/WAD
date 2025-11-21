using OfficeCalendar.Backend.DTOs;

public interface IUserService
{
    Task<List<UserSearchDto>> GetAllUsersAsync();
    Task<UserSearchDto?> ChangeUserRoleAsync(string username, int newRole);
}
