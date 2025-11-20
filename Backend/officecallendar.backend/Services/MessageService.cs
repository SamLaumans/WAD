using Officecalendar.Backend.Models;
using OfficeCalendar.Backend.DTOs;
using WADapi.Data;

namespace OfficeCalendar.Backend.Services
{
    public class MessageService
    {
        private readonly AppDbContext _context;

        public MessageService(AppDbContext context)
        {
            _context = context;
        }

        public Message? GetByGuid(Guid messageId)
        {
            return _context.Messages.FirstOrDefault(m => m.id == messageId);
        }

        public Message PostMessage(MessagePostDto dto, string username)
        {
            var message = new Message
            {
                id = new Guid(),
                sender_username = username,
                title = dto.title,
                desc = dto.desc,
                referenced_event_id = dto.referenced_event_id,
                creation_date = DateTime.UtcNow
            };

            _context.Messages.Add(message);
            _context.SaveChanges();
            return message;
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
            _context.SaveChanges();
        }

        public void UpdateMessage(Message message, MessagePostDto dto)
        {
            message.title = dto.title;
            message.desc = dto.desc;
            message.referenced_event_id = dto.referenced_event_id;
            message.last_edited_date = DateTime.UtcNow;

            _context.SaveChanges();
        }
    }
}
