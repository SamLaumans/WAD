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

        public async Task<Message?> GetByGuid(Guid messageId)
        {
            return await _context.Messages
            .Include(m => m.MessageReceivers)
            .FirstOrDefaultAsync(m => m.id == messageId);
        }

        public async Task<MessageGetDto?> GetMessageDtoByGuid(Guid messageId)
        {
            return await _context.Messages
            .Where(m => m.id == messageId)
            .Select(m => new MessageGetDto
            {
                id = m.id,
                sender_username = m.sender_username,
                title = m.title,
                desc = m.desc,
                receivers = m.MessageReceivers.Select(r => r.username).ToList(),
                referenced_event_id = m.referenced_event_id,
                creation_date = m.creation_date,
                last_edited_date = m.last_edited_date,
                visible = m.visible
            })
            .FirstOrDefaultAsync();
        }


        public async Task<MessageGetDto[]> GetMessagesForUser(string username, int skip, int take)
        {
            return await _context.Messages
                .Where(m => m.MessageReceivers.Any(r => r.username == username))
                .Where(m => m.visible == true)
                .OrderByDescending(m => m.creation_date)
                .Skip(skip)
                .Take(take)
                .Select(m => new MessageGetDto
                {
                    id = m.id,
                    sender_username = m.sender_username,
                    title = m.title,
                    desc = m.desc,
                    receivers = m.MessageReceivers.Select(r => r.username).ToList(),
                    referenced_event_id = m.referenced_event_id,
                    creation_date = m.creation_date,
                    last_edited_date = m.last_edited_date,
                    visible = m.visible
                })
                .AsNoTracking()
                .ToArray();
        }

        public MessageGetDto[] GetMessagesSentByUser(string username, int skip, int take)
        {
            return _context.Messages
                .Where(m => m.sender_username == username)
                .Where(m => m.visible == true)
                .OrderByDescending(m => m.creation_date)
                .Skip(skip)
                .Take(take)
                .Select(m => new MessageGetDto
                {
                    id = m.id,
                    sender_username = m.sender_username,
                    title = m.title,
                    desc = m.desc,
                    receivers = m.MessageReceivers.Select(r => r.username).ToList(),
                    referenced_event_id = m.referenced_event_id,
                    creation_date = m.creation_date,
                    last_edited_date = m.last_edited_date,
                    visible = m.visible
                })
                .AsNoTracking()
                .ToArrayAsync();
        }

        public async Task<(bool success, string? error, MessageGetDto? message)> PostMessage(MessagePostDto dto, string username)
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
            await _context.SaveChangesAsync();

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

            await _context.SaveChangesAsync();

            var messageDto = new MessageGetDto
            {
                id = message.id,
                sender_username = message.sender_username,
                title = message.title,
                desc = message.desc,
                receivers = uniqueReceivers,
                referenced_event_id = message.referenced_event_id,
                creation_date = message.creation_date,
                last_edited_date = message.last_edited_date,
                visible = message.visible
            };

            return (true, null, messageDto);
        }

        public async Task DeleteMessage(Message message)
        {
            message.visible = false;
            await _context.SaveChangesAsync();
        }

        public async Task<MessageGetDto> UpdateMessage(Message message, MessagePutDto dto)
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

            await _context.SaveChangesAsync();

            var uniqueReceivers = dto.receivers.Distinct().ToList();

            return new MessageGetDto
            {
                id = message.id,
                sender_username = message.sender_username,
                title = message.title,
                desc = message.desc,
                receivers = uniqueReceivers,
                referenced_event_id = message.referenced_event_id,
                creation_date = message.creation_date,
                last_edited_date = message.last_edited_date,
                visible = message.visible
            };
        }
    }
}
