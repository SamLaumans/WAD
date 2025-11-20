namespace OfficeCalendar.Backend.DTOs
{
    public class MessagePostDto
    {
        public required string title { get; set; }
        public string desc { get; set; } = string.Empty;
        public Guid? referenced_event_id { get; set; }
    }

    public class MessagePutDto
    {
        public string? title { get; set; }
        public string? desc { get; set; } = string.Empty;
        public Guid? referenced_event_id { get; set; }
    }

    public class MessageGetDto
    {
        public required string sender_username { get; set; }
        public required string title { get; set; }
        public string desc { get; set; } = string.Empty;
        public Guid? referenced_event_id { get; set; }
        public DateTime creation_date { get; set; }
        public DateTime? last_edited_date { get; set; }

    }

}
