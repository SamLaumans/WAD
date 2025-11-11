using System.ComponentModel.DataAnnotations;

namespace Officecalendar.Backend.Models
{
    public class RoomBooking
    {
        public required Guid id { get; set; }
        public required Guid room_id { get; set; }
        public required DateTime start_time { get; set; }
        public required DateTime end_time { get; set; }
        public required string booked_by { get; set; }
        public Guid event_id { get; set; }

        public Room Room { get; set; } = null!;
        public User User { get; set; } = null!;
        public Event Event { get; set; } = null!;

        public ICollection<Event> Events { get; set; } = new List<Event>();
    }
}