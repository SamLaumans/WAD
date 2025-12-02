namespace OfficeCalendar.Backend.DTOs
{
    public class UserSearchDto
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public int Role { get; set; }
    }
}
