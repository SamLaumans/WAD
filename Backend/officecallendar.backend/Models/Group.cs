using System.ComponentModel.DataAnnotations;

namespace Officecalendar.Backend.Models
{
    public class Group
    {
        [Key]
        public required Guid id { get; set; }
        public required string name { get; set; }
        public string desc { get; set; } = "";

        public ICollection<GroupMembership> GroupMemberships { get; set; } = new List<GroupMembership>();

    }
}