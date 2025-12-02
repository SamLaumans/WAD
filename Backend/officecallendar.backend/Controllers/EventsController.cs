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
        private readonly EventService _service;

        public EventsController(EventService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<IEnumerable<EventGetDto>> GetEvents()
        {
            return Ok(_service.GetAllEvents());
        }

        [HttpGet("{id:guid}")]
        public ActionResult<EventGetDto> GetEvent(Guid id)
        {
            var dto = _service.GetEventDto(id);
            if (dto == null) return NotFound();
            return Ok(dto);
        }

        [HttpPost]
        public ActionResult<EventGetDto> PostEvent(EventPostDto dto)
        {
            string creator_username = User.Identity.Name;

            var created = _service.CreateEvent(dto, creator_username);
            return Ok(created);
        }

        [HttpPut("{id:guid}")]
        public ActionResult<EventGetDto> UpdateEvent(Guid id, EventPutDto dto)
        {
            var ev = _service.GetEvent(id);
            if (ev == null) return NotFound();

            var updated = _service.UpdateEvent(ev, dto);
            return Ok(updated);
        }

        [HttpDelete("{id:guid}")]
        public IActionResult DeleteEvent(Guid id)
        {
            var ev = _service.GetEvent(id);
            if (ev == null) return NotFound();

            _service.DeleteEvent(ev);
            return NoContent();
        }
    }
}
