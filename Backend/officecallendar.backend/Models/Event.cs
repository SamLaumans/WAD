using System.ComponentModel.DataAnnotations;

namespace Officecalendar.Backend.Models
{
    public class Event
    {
        [Key]
        public required Guid id { get; set; }
        public required string creator_username { get; set; }
        public required string title { get; set; }
        public string desc { get; set; } = "";
        public required DateTime start_time { get; set; }
        public required DateTime end_time { get; set; }
        public DateTime last_edited_date { get; set; }
        public Guid booking_id { get; set; }

        public User User { get; set; } = null!;
        public User Creator { get; set; } = null!;
        public RoomBooking RoomBooking { get; set; } = null!;

        public ICollection<EventSubscription> EventSubscriptions { get; set; } = new List<EventSubscription>();
        public ICollection<RoomBooking> RoomBookings { get; set; } = new List<RoomBooking>();
        public ICollection<Message> Messages { get; set; } = new List<Message>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();

    }
}