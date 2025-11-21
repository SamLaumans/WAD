using System.ComponentModel.DataAnnotations;

namespace Officecalendar.Backend.Models
{
    public class Review
    {
        [Key]
        public required Guid id { get; set; }
        public required Guid event_id { get; set; }
        public required string username { get; set; }
        public required int stars { get; set; }
        public string desc { get; set; } = "";
        public required DateTime creation_date { get; set; }
        public DateTime last_edited_date { get; set; }
        public bool visible { get; set; } = true;

        public Event Event { get; set; } = null!;
        public User User { get; set; } = null!;

    }


}