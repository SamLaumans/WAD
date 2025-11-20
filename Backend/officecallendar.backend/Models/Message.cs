using System.ComponentModel.DataAnnotations;

namespace Officecalendar.Backend.Models
{
    public class Message
    {
        [Key]
        public required Guid id { get; set; }
        public required string sender_username { get; set; }
        public required string title { get; set; }
        public string desc { get; set; } = "";
        public Guid? referenced_event_id { get; set; }
        public required DateTime creation_date { get; set; }
        public DateTime last_edited_date { get; set; }
        public Event Event { get; set; } = null!;

        public ICollection<MessageReceiver> MessageReceivers { get; set; } = new List<MessageReceiver>();

    }
}