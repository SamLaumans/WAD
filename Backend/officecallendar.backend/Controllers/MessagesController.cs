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
        var message = _messageService.GetMessageDtoByGuid(messageid);
        if (message == null)
            return NotFound(new
            {
                statuscode = 404,
                message = $"Message with id {messageid} not found"
            });

        if (message.sender_username != User.Identity.Name && !message.receivers.Contains(User.Identity.Name))
        {
            return Forbid();
        }

        return Ok(message);
    }

    [HttpGet("me")]
    public ActionResult<MessageGetDto[]> GetMessageForUser([FromQuery] int skip = 0, [FromQuery] int take = 20)
    {
        var messages = _messageService.GetMessagesForUser(User.Identity.Name, skip, take);

        if (messages.Length == 0)
            return NotFound(new
            {
                statuscode = 404,
                message = $"No messages for {User.Identity.Name} found"
            });

        return Ok(messages);
    }

    [HttpGet("sent")]
    public ActionResult<MessageGetDto[]> GetMessagesSentByUser([FromQuery] int skip = 0, [FromQuery] int take = 20)
    {
        var messages = _messageService.GetMessagesSentByUser(User.Identity.Name, skip, take);

        if (messages.Length == 0)
            return NotFound(new
            {
                statuscode = 404,
                message = $"No messages sent by {User.Identity.Name} found"
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

        return CreatedAtAction(nameof(GetMessage), new { messageid = response.message.id }, response);
    }

    [Authorize(Roles = "1")]
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

        MessageGetDto updatedDto = _messageService.UpdateMessage(message, dto);

        return Ok(updatedDto);
    }
}
