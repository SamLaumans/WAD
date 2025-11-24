using System.ComponentModel.DataAnnotations;

namespace Officecalendar.Backend.Models
{
    public class Room
    {
        [Key]
        public required Guid id { get; set; }
        public required string room_location { get; set; }
        public required bool available { get; set; }
        public int? capacity { get; set; }
        public bool visible { get; set; } = true;


        public ICollection<RoomBooking> RoomBookings { get; set; } = new List<RoomBooking>();
        public ICollection<RoomBookingRoom> RoomBookingRooms { get; set; } = new List<RoomBookingRoom>();

    }
}