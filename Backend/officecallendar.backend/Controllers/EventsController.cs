using Microsoft.AspNetCore.Mvc;
using OfficeCalendar.Backend.DTOs;
using OfficeCalendar.Backend.Services;
using WADapi.Data;
using Microsoft.AspNetCore.Authorization;

namespace Officecalendar.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        //create service instance
        private readonly EventService _service;

        public EventsController(EventService service)
        {
            _service = service;
        }

        //Get all events
        [HttpGet("get-all")]
        [Authorize(Roles = "1")]
        public async Task<ActionResult<IEnumerable<EventGetDto>>> GetEvents()
        {
            return Ok(await _service.GetAllEvents());
        }

        //Get my events
        [HttpGet("my-events")]
        public async Task<ActionResult<IEnumerable<EventGetDto>>> GetMyEvents()
        {
            string username = User.Identity.Name;
            if (username == null) return Unauthorized();
            return Ok(await _service.GetMyEvents(username));
        }

        //Get event by id
        [HttpGet("get-one")]
        public async Task<ActionResult<EventGetDto>> GetEvent([FromQuery] Guid eventid)
        {
            var dto = await _service.GetEventDto(eventid);
            if (dto == null) return NotFound();
            return Ok(dto);
        }

        //Post event
        [HttpPost]
        public async Task<ActionResult<EventGetDto>> PostEvent(EventPostDto dto)
        {
            string creator_username = User.Identity.Name;
            var created = await _service.CreateEvent(dto, creator_username);
            return Ok(created);
        }

        //Update event by id
        [HttpPut]
        public async Task<ActionResult<EventGetDto>> UpdateEvent([FromQuery] Guid eventid, EventPutDto dto)
        {
            var ev = await _service.GetEvent(eventid);
            if (ev == null) return NotFound();
            if (ev.creator_username != User.Identity.Name && !User.IsInRole("1")) return Unauthorized();
            var updated = await _service.UpdateEvent(ev, dto);
            return Ok(updated);
        }

        //Delete event by id
        [HttpDelete]
        public async Task<IActionResult> DeleteEvent([FromQuery] Guid eventid)
        {
            var ev = await _service.GetEvent(eventid);
            if (ev == null) return NotFound();
            if (ev.creator_username != User.Identity.Name && !User.IsInRole("1")) return Unauthorized();
            await _service.DeleteEvent(ev);
            return NoContent();
        }
    }
}
