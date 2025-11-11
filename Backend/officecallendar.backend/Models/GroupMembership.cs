using System.ComponentModel.DataAnnotations;

namespace Officecalendar.Backend.Models
{
    public class GroupMembership
    {
        public required string username { get; set; }
        public required Guid group_id { get; set; }

        public User User { get; set; } = null!;
        public Group Group { get; set; } = null!;
    }
}