namespace OfficeCalendar.Backend.DTOs
{
    public class ReviewsPostDto
    {
        public required Guid event_id { get; set; }
        public required string username { get; set; }
        public required int stars { get; set; }
        public string desc { get; set; } = string.Empty;
    }
    public class ReviewsGetDto
    {
        public required Guid id { get; set; }
        public required Guid event_id { get; set; }
        public required string username { get; set; }
        public required int stars { get; set; }
        public string desc { get; set; } = string.Empty;
        public DateTime creation_date { get; set; }
        public DateTime last_edited_date { get; set; }
    }
    public class ReviewsPutDto
    {
        public Guid? event_id { get; set; }
        public string? username { get; set; }
        public int? stars { get; set; }
        public string? desc { get; set; } = string.Empty;
        public bool? visible { get; set; }
        public Guid? referenced_event_id { get; set; }
    }
}