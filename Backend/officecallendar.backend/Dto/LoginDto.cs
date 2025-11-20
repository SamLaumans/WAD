namespace OfficeCalendar.Backend.DTOs
{
    public class LoginPostDto
    {
        public string username { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;
    }

    public class LoginResponseDto
    {
        public bool success { get; set; }
        public string message { get; set; } = string.Empty;
        public string username { get; set; } = string.Empty;
        public string token { get; set; } = string.Empty;
    }

}
