using System.Text.Json.Serialization;
using Officecalendar.Backend.Models;

namespace OfficeCalendar.Backend.DTOs
{
    public class RoomBookingPostDto
    {
        public required Guid room_id { get; set; }
        public required DateTime start_time { get; set; }
        public required DateTime end_time { get; set; }
        public Guid? event_id { get; set; } = null;
    }

    public class RoomBookingPutDto
    {

        public Guid? room_id { get; set; }
        public DateTime? start_time { get; set; }
        public DateTime? end_time { get; set; }
        public Guid? event_id { get; set; }
        public bool? visible { get; set; }
    }

    public class RoomBookingGetDto
    {
        public required Guid id { get; set; }
        public required RoomGetDto room { get; set; }
        public required DateTime start_time { get; set; }
        public required DateTime end_time { get; set; }
        public required UserGetDto booked_by { get; set; }
        [JsonPropertyName("event")]
        public EventGetDto? Event { get; set; }
        public required bool visible { get; set; } = true;

    }

}
