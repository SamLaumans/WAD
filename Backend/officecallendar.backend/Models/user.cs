using System.ComponentModel.DataAnnotations;

namespace Officecalendar.Backend.Models
{
    public class User
    {
        [Key]
        public required string username { get; set; }
        public required string email { get; set; }
        public required string password { get; set; }
        public required string nickname { get; set; }
        public required DateTime creation_date { get; set; }
        public required int role { get; set; } = 0;

        public ICollection<GroupMembership> GroupMemberships { get; set; } = new List<GroupMembership>();
        public ICollection<MessageReceiver> MessageReceivers { get; set; } = new List<MessageReceiver>();
        public ICollection<EventSubscription> EventSubscriptions { get; set; } = new List<EventSubscription>();
        public ICollection<RoomBooking> RoomBookings { get; set; } = new List<RoomBooking>();
        public ICollection<Event> Events { get; set; } = new List<Event>();
        public ICollection<Event> CreatedEvents { get; set; } = new List<Event>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();


    }
}