using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Officecalendar.Backend.Models
{
    public class RoomBooking
    {
        public required Guid id { get; set; }
        public required Guid room_id { get; set; }
        public required DateTime start_time { get; set; }
        public required DateTime end_time { get; set; }
        public required string booked_by { get; set; }
        public Guid? event_id { get; set; }
        public bool visible { get; set; } = true;

        public Room Room { get; set; } = null!;

        [ForeignKey(nameof(booked_by))]
        public User User { get; set; } = null!;

        [ForeignKey(nameof(event_id))]
        public Event? Event { get; set; }

    }
}