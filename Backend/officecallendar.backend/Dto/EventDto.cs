namespace OfficeCalendar.Backend.DTOs
{
    public class EventPostDto
    {
        public required string title { get; set; }
        public string desc { get; set; } = string.Empty;
        public required DateTime start_time { get; set; }
        public required DateTime end_time { get; set; }
        public Guid? booking_id { get; set; } = null;
    }

    public class EventPutDto
    {
        public string? title { get; set; }
        public string? desc { get; set; }
        public DateTime? start_time { get; set; }
        public DateTime? end_time { get; set; }
        public Guid? booking_id { get; set; }
        public bool? visible { get; set; } = true;
        public required DateTime last_edited_date { get; set; }
    }

    public class EventGetDto
    {
        public required Guid id { get; set; }
        public required UserGetDto creator { get; set; }
        public required string title { get; set; }
        public required string desc { get; set; }
        public required DateTime start_time { get; set; }
        public required DateTime end_time { get; set; }
        public required DateTime? last_edited_date { get; set; }
        public List<RoomBookingGetDto>? bookings { get; set; }
    }

}
