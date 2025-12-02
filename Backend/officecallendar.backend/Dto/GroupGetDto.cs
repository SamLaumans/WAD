namespace OfficeCalendar.Backend.DTOs
{
    public class GroupGetDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Desc { get; set; } = string.Empty;

        public List<MembershipDto> Members { get; set; } = new();
    }
}
