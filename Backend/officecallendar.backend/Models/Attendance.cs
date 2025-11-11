using System.ComponentModel.DataAnnotations;

namespace Officecalendar.Backend.Models
{
    public class Attendance
    {
        [Key]
        public required Guid id { get; set; }
        public required string username { get; set; }
        public required DateTime date { get; set; }
        public required string status { get; set; }

        public User User { get; set; } = null!;

    }
}