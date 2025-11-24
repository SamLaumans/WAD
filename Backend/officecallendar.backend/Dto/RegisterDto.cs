namespace OfficeCalendar.Backend.DTOs
{
    public class RegisterPostDto
    {
        public required string username { get; set; }
        public required string password { get; set; }
        public required string email { get; set; }
        public required string nickname { get; set; }
    }

    public class RegisterResponseDto
    {
        public bool success { get; set; }
        public string message { get; set; } = string.Empty;
        public string username { get; set; } = string.Empty;
        public string token { get; set; } = string.Empty;
    }
}
