using Officecalendar.Backend.Models;

namespace WADapi.Data
{
    public static class DbInitializer
    {
        public static void Seed(AppDbContext context)
        {
            if (context.Users.Any())
                return;

            var users = new List<User>
            {
                new User { nickname = "johny", username = "john", email = "john@example.com", password = "1234", role = 0, creation_date = DateTime.Now },
                new User { nickname = "sara", username = "sarah", email = "sarah@example.com", password = "1234", role = 1, creation_date = DateTime.Now },
                new User { nickname = "admine", username = "admin", email = "admin@example.com", password = "1234", role = 2, creation_date = DateTime.Now },
                new User { nickname = "mikee", username = "mike", email = "mike@example.com", password = "1234", role = 0, creation_date = DateTime.Now },
                new User { nickname = "danny", username = "jozef", email = "daniel@example.com", password = "1234", role = 0, creation_date = DateTime.Now },
                new User { nickname = "katty", username = "katie", email = "katie@example.com", password = "1234", role = 1, creation_date = DateTime.Now },
                new User { nickname = "stevy", username = "johny", email = "steve@example.com", password = "1234", role = 0, creation_date = DateTime.Now },
                new User { nickname = "milly", username = "sara", email = "mila@example.com", password = "1234", role = 0, creation_date = DateTime.Now },
                new User { nickname = "tommy", username = "tom", email = "tom@example.com", password = "1234", role = 1, creation_date = DateTime.Now },
                new User { nickname = "lizzy", username = "liz", email = "liz@example.com", password = "1234", role = 0, creation_date = DateTime.Now },
                new User { nickname = "robbie", username = "sam", email = "rob@example.com", password = "1234", role = 0, creation_date = DateTime.Now },
                new User { nickname = "timmy", username = "tim", email = "tim@example.com", password = "1234", role = 2, creation_date = DateTime.Now }

            };

            context.Users.AddRange(users);
            context.SaveChanges();
        }
    }
}
