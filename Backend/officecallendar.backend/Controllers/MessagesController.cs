using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Officecalendar.Backend.Models;
using OfficeCalendar.Backend.DTOs;
using OfficeCalendar.Backend.Services;

namespace OfficeCalendar.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly MessageService _messageService;

    public MessagesController(MessageService messageService)
    {
        _messageService = messageService;
    }

    [HttpGet]
    public ActionResult<MessageGetDto> GetMessage([FromQuery] Guid messageid)
    {
        var message = _messageService.GetByGuid(messageid);
        if (message == null)
            return NotFound(new
            {
                statuscode = 404,
                message = $"Message with id {messageid} not found"
            });

        if (message.sender_username != User.Identity.Name && !message.MessageReceivers.Any(u => u.username == User.Identity.Name))
        {
            return Forbid();
        }

        var dto = new MessageGetDto
        {
            sender_username = message.sender_username,
            title = message.title,
            desc = message.desc,
            receivers = message.MessageReceivers.Select(r => r.username).ToList(),
            referenced_event_id = message.referenced_event_id,
            creation_date = message.creation_date,
            last_edited_date = message.last_edited_date
        };

        return Ok(dto);
    }

    [HttpGet("me")]
    public ActionResult<MessageGetDto[]> GetMessageForUser()
    {
        var messages = _messageService.GetMessagesForUser(User.Identity.Name);

        if (messages.Length == 0)
            return NotFound(new
            {
                statuscode = 404,
                message = $"No messages for {User.Identity.Name} found"
            });

        return Ok(messages);
    }

    [HttpPost]
    public ActionResult<MessageGetDto> CreateMessage(MessagePostDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(
                new
                {
                    statuscode = 400,
                    message = ModelState
                });

        var response = _messageService.PostMessage(dto, User.Identity.Name);
        if (!response.success)
        {
            return NotFound(new
            {
                statuscode = 404,
                message = response.error
            });
        }

        var createdDto = new MessageGetDto
        {
            sender_username = response.message.sender_username,
            title = response.message.title,
            desc = response.message.desc,
            receivers = response.message.MessageReceivers.Select(r => r.username).ToList(),
            referenced_event_id = response.message.referenced_event_id,
            creation_date = response.message.creation_date,
            last_edited_date = response.message.last_edited_date
        };

        return CreatedAtAction(nameof(GetMessage), new { messageid = response.message.id }, createdDto);
    }

    [HttpDelete]
    public ActionResult<Message> DeleteMessage([FromQuery] Guid messageid)
    {
        var message = _messageService.GetByGuid(messageid);
        if (message == null)
            return NotFound(new
            {
                statuscode = 404,
                message = $"Message with id {messageid} not found"
            });

        if (message.sender_username != User.Identity.Name)
        {
            return Forbid();
        }

        _messageService.DeleteMessage(message);

        return NoContent();
    }

    [HttpPut]
    public ActionResult<MessageGetDto> UpdateMessage([FromQuery] Guid messageid, MessagePutDto dto)
    {
        var message = _messageService.GetByGuid(messageid);
        if (message == null)
            return NotFound(new
            {
                statuscode = 404,
                message = $"Message with id {messageid} not found"
            });

        if (message.sender_username != User.Identity.Name)
        {
            return Forbid();
        }

        _messageService.UpdateMessage(message, dto);

        var updatedDto = new MessageGetDto
        {
            sender_username = message.sender_username,
            title = message.title,
            desc = message.desc,
            receivers = message.MessageReceivers.Select(r => r.username).ToList(),
            referenced_event_id = message.referenced_event_id,
            creation_date = message.creation_date,
            last_edited_date = message.last_edited_date
        };

        return Ok(updatedDto);
    }
}
