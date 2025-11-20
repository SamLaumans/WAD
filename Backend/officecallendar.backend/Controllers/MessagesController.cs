using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Officecalendar.Backend.Models;
using OfficeCalendar.Backend.DTOs;
using OfficeCalendar.Backend.Services;

namespace OfficeCalendar.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MessageController : ControllerBase
{
    private readonly MessageService _messageService;

    public MessageController(MessageService messageService)
    {
        _messageService = messageService;
    }

    [HttpGet("{messageid}")]
    public ActionResult<Message> GetByGuid(Guid messageid)
    {
        var message = _messageService.GetByGuid(messageid);
        if (message == null)
            return NotFound(new
            {
                statuscode = 404,
                message = $"Message with id {messageid} not found"
            });

        return Ok(message);
    }

    [HttpPost]
    public ActionResult<Message> CreateMessage(MessagePostDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(
                new
                {
                    statuscode = 400,
                    message = ModelState
                });

        var message = _messageService.PostMessage(dto, User.Identity.Name);
        return CreatedAtAction(nameof(GetByGuid), new { messageid = message.id }, message);
    }

    [HttpDelete("{messageid}")]
    public ActionResult<Message> DeleteMessage(Guid messageid)
    {
        var message = _messageService.GetByGuid(messageid);
        if (message == null)
            return NotFound(new
            {
                statuscode = 404,
                message = $"Message with id {messageid} not found"
            });

        _messageService.DeleteMessage(message);

        return NoContent();
    }

    [HttpPut("{reservationid}")]
    public ActionResult<Message> UpdateMessage(Guid messageid, MessagePostDto dto)
    {
        var message = _messageService.GetByGuid(messageid);
        if (message == null)
            return NotFound(new
            {
                statuscode = 404,
                message = $"Message with id {messageid} not found"
            });

        _messageService.UpdateMessage(message, dto);
        return CreatedAtAction(nameof(GetByGuid), new { messageid = message.id }, message);

    }
}
