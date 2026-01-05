using System.ComponentModel.DataAnnotations;

namespace OfficeCalendar.Backend.DTOs
{
    public class RegisterPostDto
    {
        [RegularExpression(@"^[a-zA-Z0-9_]+$", ErrorMessage = "Username can only contain letters, numbers, and underscores.")]
        public required string username { get; set; }
        public required string password { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public required string email { get; set; }

        [RegularExpression(@"^[a-zA-Z ]+$", ErrorMessage = "Nickname can only contain letters and spaces")]
        public string? nickname { get; set; }
    }

    public class RegisterResponseDto
    {
        public bool success { get; set; }
        public string message { get; set; } = string.Empty;
        public string username { get; set; } = string.Empty;
        public string token { get; set; } = string.Empty;
        public int role { get; set; }
    }
}
