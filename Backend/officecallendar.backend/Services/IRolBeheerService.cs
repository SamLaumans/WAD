using OfficeCalendar.Backend.DTOs;

public interface IUserService
{
    Task<List<UserSearchDto>> SearchUsersByUsernameAsync(string query);
    Task<UserSearchDto?> ChangeUserRoleAsync(string username, int newRole);
}
