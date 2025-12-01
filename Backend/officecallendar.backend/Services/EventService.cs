using Officecalendar.Backend.Models;
using OfficeCalendar.Backend.DTOs;
using WADapi.Data;

namespace OfficeCalendar.Backend.Services
{
    public class EventService
    {
        private readonly AppDbContext _context;

        public EventService(AppDbContext context)
        {
            _context = context;
        }

        // Maakt een Event aan en slaat deze op. Geeft het opgeslagen Event terug.
        public Event PostEvent(EventPostDto dto, string creatorUsername)
        {
            if (dto.start_time >= dto.end_time)
                throw new ArgumentException("start_time must be before end_time");

            var ev = new Event
            {
                id = Guid.NewGuid(),
                creator_username = creatorUsername,
                title = dto.title,
                desc = dto.desc ?? string.Empty,
                start_time = dto.start_time,
                end_time = dto.end_time,
                booking_id = dto.booking_id,
                last_edited_date = DateTime.UtcNow
            };

            _context.Events.Add(ev);
            _context.SaveChanges();

            return ev;
        }

        // Verwerkt het formulier uit de frontend (EventFormDto) en slaat een Event op.
        // starttijd/eindtijd kunnen een volledige DateTime-string bevatten of alleen een tijd ("HH:mm").
        public Event PostEventForm(EventFormDto formDto)
        {
            DateTime ParseDateTime(string input)
            {
                // Probeer volledige DateTime
                if (DateTime.TryParse(input, out var dt))
                    return dt.ToUniversalTime();

                // Probeer alleen tijd (HH:mm of HH:mm:ss) -> combineer met huidige datum (UTC)
                if (TimeSpan.TryParse(input, out var ts))
                    return DateTime.UtcNow.Date.Add(ts);

                throw new ArgumentException($"Ongeldige datum/tijd: {input}");
            }

            var start = ParseDateTime(formDto.starttijd);
            var end = ParseDateTime(formDto.eindtijd);

            if (start >= end)
                throw new ArgumentException("start_time must be before end_time");

            var ev = new Event
            {
                id = Guid.NewGuid(),
                creator_username = formDto.creator_username ?? "system",
                title = formDto.naam,
                desc = formDto.info ?? string.Empty,
                start_time = start,
                end_time = end,
                last_edited_date = DateTime.UtcNow
            };

            _context.Events.Add(ev);
            _context.SaveChanges();

            return ev;
        }

        public Event? GetEvent(Guid id)
        {
            return _context.Events.FirstOrDefault(e => e.id == id);
        }
    }
}