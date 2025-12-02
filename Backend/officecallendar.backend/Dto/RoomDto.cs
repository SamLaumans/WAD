using System.ComponentModel.DataAnnotations;

namespace OfficeCalendar.Backend.DTOs
{
    public class RoomPostDto
    {
        [RegularExpression(@"^[a-zA-Z0-9_. ]+$", ErrorMessage = "Location name can only contain letters, numbers, underscores, dots and spaces")]
        public required string room_location { get; set; }
        public bool available { get; set; } = true;
        public int? capacity { get; set; } = null;
    }

    public class RoomPutDto
    {
        [RegularExpression(@"^[a-zA-Z0-9_. ]+$", ErrorMessage = "Location name can only contain letters, numbers, underscores, dots and spaces")]
        public string? room_location { get; set; }
        public bool? available { get; set; }
        public int? capacity { get; set; }
        public bool? visible { get; set; }
    }

    public class RoomGetDto
    {
        public required Guid id { get; set; }
        public required string room_location { get; set; }
        public required bool available { get; set; }
        public required int? capacity { get; set; }
        public required bool visible { get; set; }

    }

}
