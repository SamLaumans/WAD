using Microsoft.AspNetCore.Mvc;
using OfficeCalendar.Backend.DTOs;
using OfficeCalendar.Backend.Services;
using WADapi.Data;

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
        public ActionResult<IEnumerable<EventGetDto>> GetEvents()
        {
            return Ok(_service.GetAllEvents());
        }

        //Get event by id
        [HttpGet("get-one")]
        public ActionResult<EventGetDto> GetEvent([FromQuery] Guid eventid)
        {
            var dto = _service.GetEventDto(eventid);
            if (dto == null) return NotFound();
            return Ok(dto);
        }

        //Post event
        [HttpPost]
        public ActionResult<EventGetDto> PostEvent(EventPostDto dto)
        {
            string creator_username = User.Identity.Name;
            var created = _service.CreateEvent(dto, creator_username);
            return Ok(created);
        }

        //Update event by id
        [HttpPut]
        public ActionResult<EventGetDto> UpdateEvent([FromQuery] Guid eventid, EventPutDto dto)
        {
            var ev = _service.GetEvent(eventid);
            if (ev == null) return NotFound();
            var updated = _service.UpdateEvent(ev, dto);
            return Ok(updated);
        }

        //Delete event by id
        [HttpDelete]
        public IActionResult DeleteEvent([FromQuery] Guid eventid)
        {
            var ev = _service.GetEvent(eventid);
            if (ev == null) return NotFound();
            _service.DeleteEvent(ev);
            return NoContent();
        }
    }
}
