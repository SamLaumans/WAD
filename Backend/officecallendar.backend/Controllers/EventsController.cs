using Microsoft.AspNetCore.Mvc;
using OfficeCalendar.Backend.DTOs;
using Officecalendar.Backend.Models;
using OfficeCalendar.Backend.Services;

namespace OfficeCalendar.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly EventService _eventService;

        public EventsController(EventService eventService)
        {
            _eventService = eventService;
        }

        // POST /api/events?creator=username
        [HttpPost]
        public IActionResult CreateEvent([FromBody] EventPostDto dto, [FromQuery] string? creator)
        {
            if (string.IsNullOrWhiteSpace(creator))
                return BadRequest(new { error = "creator query parameter is required (e.g. ?creator=username)" });

            try
            {
                var ev = _eventService.PostEvent(dto, creator);
                var resp = new
                {
                    id = ev.id,
                    title = ev.title,
                    desc = ev.desc,
                    start_time = ev.start_time,
                    end_time = ev.end_time,
                    booking_id = ev.booking_id,
                    creator_username = ev.creator_username
                };
                return CreatedAtAction(nameof(GetEvent), new { id = ev.id }, resp);
            }
            catch (ArgumentException aEx)
            {
                return BadRequest(new { error = aEx.Message });
            }
        }

        // POST /api/events/from-form
        // Ontvangt het formulier uit de frontend (EventFormDto) en maakt een Event aan.
        [HttpPost("event-form")]
        public IActionResult CreateEventForm([FromBody] EventFormDto dto)
        {
            try
            {
                var ev = _eventService.PostEventForm(dto);
                var resp = new
                {
                    id = ev.id,
                    title = ev.title,
                    desc = ev.desc,
                    start_time = ev.start_time,
                    end_time = ev.end_time,
                    booking_id = ev.booking_id,
                    creator_username = ev.creator_username
                };
                return CreatedAtAction(nameof(GetEvent), new { id = ev.id }, resp);
            }
            catch (ArgumentException aEx)
            {
                return BadRequest(new { error = aEx.Message });
            }
        }

        // GET /api/events/{id}
        [HttpGet("{id:guid}")]
        public IActionResult GetEvent(Guid id)
        {
            var ev = _eventService.GetEvent(id);
            if (ev == null) return NotFound();
            return Ok(new
            {
                id = ev.id,
                title = ev.title,
                desc = ev.desc,
                start_time = ev.start_time,
                end_time = ev.end_time,
                booking_id = ev.booking_id,
                creator_username = ev.creator_username
            });
        }
    }
}