namespace Officecalendar.Backend.Models
{
    public class EventSubscription
    {
        public required string username { get; set; }
        public required Guid event_id { get; set; }
        public required bool participated { get; set; }


        public User User { get; set; } = null!;
        public Event Event { get; set; } = null!;
    }
}