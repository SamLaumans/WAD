namespace OfficeCalendar.Backend.DTOs
{
    public class MembershipDto
    {
        public string Username { get; set; } = string.Empty;
        public Guid GroupId { get; set; }
    }
}