namespace OfficeCalendar.Backend.DTOs
{
    public class UserPostDto
    {
        public required string username { get; set; }
        public required string email { get; set; }
        public required string password { get; set; }
        public required string nickname { get; set; }
        public int role { get; set; } = 0;
    }

    public class UserPutDto
    {
        public string? email { get; set; }
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
