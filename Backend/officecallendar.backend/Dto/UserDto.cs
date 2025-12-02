using System.ComponentModel.DataAnnotations;

namespace OfficeCalendar.Backend.DTOs
{
    public class UserPostDto
    {
        [RegularExpression(@"^[a-zA-Z0-9_]+$", ErrorMessage = "Username can only contain letters, numbers, and underscores.")]
        public required string username { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public required string email { get; set; }
        public required string password { get; set; }

        [RegularExpression(@"^[a-zA-Z ]+$", ErrorMessage = "Nickname can only contain letters and spaces")]
        public required string nickname { get; set; }
        public int role { get; set; } = 0;
    }

    public class UserPutDto
    {
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public string? email { get; set; }

        [RegularExpression(@"^[a-zA-Z ]+$", ErrorMessage = "Nickname can only contain letters and spaces")]
        public string? nickname { get; set; }
        public int? role { get; set; }
    }

    public class UserGetDto
    {
        public required string username { get; set; }
        public required string email { get; set; }
        public required string nickname { get; set; }
        public required DateTime creation_date { get; set; }
        public required int role { get; set; }
    }

}
