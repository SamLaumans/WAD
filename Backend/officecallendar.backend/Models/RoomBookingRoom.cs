namespace Officecalendar.Backend.Models
{
    public class RoomBookingRoom
    {
        public required Guid booking_id { get; set; }
        public required RoomBooking RoomBooking { get; set; }

        public required Guid room_id { get; set; }
        public required Room Room { get; set; }
    }
}
