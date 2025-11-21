namespace OfficeCalendar.Backend.DTOs
{
    public class AttendancePostDto
    {
        public required string username { get; set; }
        public required DateTime date { get; set; }
        public string status { get; set; } = string.Empty;
        public bool visible { get; set; } = true;
    }

    public class AttendancePutDto
    {
        public string? username { get; set; }
        public DateTime? date { get; set; }
        public string? status { get; set; } = string.Empty;
        public bool? visible { get; set; }
    }

    public class AttendanceGetDto
    {
        public Guid id { get; set; }
        public required string username { get; set; }
        public required string creator_username { get; set; }
        public required DateTime date { get; set; }
        public string status { get; set; } = string.Empty;

    }

}
