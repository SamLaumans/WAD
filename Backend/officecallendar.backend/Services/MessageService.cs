using Microsoft.EntityFrameworkCore;
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
            return _context.Messages
            .Include(m => m.MessageReceivers)
            .FirstOrDefault(m => m.id == messageId);
        }

        public MessageGetDto[] GetMessagesForUser(string username)
        {
            return _context.Messages
                .Where(m => m.MessageReceivers.Any(r => r.username == username))
                .Where(m => m.visible == true)
                .Select(m => new MessageGetDto
                {
                    sender_username = m.sender_username,
                    title = m.title,
                    desc = m.desc,
                    receivers = m.MessageReceivers.Select(r => r.username).ToList(),
                    referenced_event_id = m.referenced_event_id,
                    creation_date = m.creation_date,
                    last_edited_date = m.last_edited_date
                })
                .AsNoTracking()
                .ToArray();
        }

        public (bool success, string? error, Message? message) PostMessage(MessagePostDto dto, string username)
        {
            var message = new Message
            {
                id = Guid.NewGuid(),
                sender_username = username,
                title = dto.title,
                desc = dto.desc,
                referenced_event_id = dto.referenced_event_id,
                creation_date = DateTime.UtcNow
            };

            _context.Messages.Add(message);
            _context.SaveChanges();

            var uniqueReceivers = dto.receivers.Distinct().ToList();

            var existingUsers = _context.Users
                .Where(u => dto.receivers.Contains(u.username))
                .Select(u => u.username)
                .ToHashSet();

            var invalidReceivers = uniqueReceivers.Except(existingUsers).ToList();
            if (invalidReceivers.Any())
            {
                return (false, $"The users ({string.Join(", ", invalidReceivers)}) do not exist", null);
            }

            foreach (var receiver in uniqueReceivers)
            {
                var messageReceiver = new MessageReceiver
                {
                    message_id = message.id,
                    username = receiver
                };

                _context.MessageReceivers.Add(messageReceiver);

            }

            _context.SaveChanges();

            return (true, null, message);
        }

        public void DeleteMessage(Message message)
        {
            message.visible = false;
            _context.SaveChanges();
        }

        public void UpdateMessage(Message message, MessagePutDto dto)
        {
            if (!string.IsNullOrEmpty(dto.title))
                message.title = dto.title;

            if (!string.IsNullOrEmpty(dto.desc))
                message.desc = dto.desc;

            if (dto.visible is not null)
                message.visible = dto.visible.Value;

            if (dto.referenced_event_id.HasValue)
                message.referenced_event_id = dto.referenced_event_id.Value;

            message.last_edited_date = DateTime.UtcNow;

            _context.SaveChanges();
        }
    }
}
