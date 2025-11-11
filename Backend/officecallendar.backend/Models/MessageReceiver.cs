namespace Officecalendar.Backend.Models
{
    public class MessageReceiver
    {
        public required Guid message_id { get; set; }
        public required string username { get; set; }

        public Message Message { get; set; } = null!;
        public User User { get; set; } = null!;

    }
}