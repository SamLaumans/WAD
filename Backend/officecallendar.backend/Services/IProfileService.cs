using OfficeCalendar.Backend.DTOs;

public interface IProfileService
{
    Task<UserGetDto> GetUserByUsernameAsync(string username);
}
