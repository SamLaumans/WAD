using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Officecalendar.Backend.Models;
using OfficeCalendar.Backend.DTOs;
using WADapi.Data;

namespace Officecalendar.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EventsController(AppDbContext context)
        {
            _context = context;
        }

        // MAPPER: User → UserGetDto
        private UserGetDto MapUser(User user)
        {
            return new UserGetDto
            {
                username = user.username,
                email = user.email,
                nickname = user.nickname,
                creation_date = user.creation_date,
                role = user.role
            };
        }

        // MAPPER: RoomBooking → RoomBookingGetDto
        private RoomBookingGetDto MapRoomBooking(RoomBooking rb)
        {
            return new RoomBookingGetDto
            {
                id = rb.id,
                room = new RoomGetDto
                {
                    id = rb.Room.id,
                    room_location = rb.Room.room_location,
                    available = rb.Room.available,
                    capacity = rb.Room.capacity,
                    visible = rb.Room.visible
                },
                start_time = rb.start_time,
                end_time = rb.end_time,
                booked_by = MapUser(rb.User),
                visible = rb.visible,
                Event = rb.Event == null ? null : new EventGetDto
                {
                    id = rb.Event.id,
                    creator = MapUser(rb.Event.Creator),
                    title = rb.Event.title,
                    desc = rb.Event.desc,
                    start_time = rb.Event.start_time,
                    end_time = rb.Event.end_time,
                    last_edited_date = rb.Event.last_edited_date
                }
            };
        }

        // GET ALL EVENTS
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventGetDto>>> GetEvents()
        {
            var events = await _context.Events
                .Include(e => e.Creator)
                .Include(e => e.RoomBookings).ThenInclude(rb => rb.Room)
                .Include(e => e.RoomBookings).ThenInclude(rb => rb.User)
                .ToListAsync();

            var result = events.Select(e => new EventGetDto
            {
                id = e.id,
                creator = MapUser(e.Creator),
                title = e.title,
                desc = e.desc,
                start_time = e.start_time,
                end_time = e.end_time,
                last_edited_date = e.last_edited_date,
                bookings = e.RoomBookings.Select(rb => MapRoomBooking(rb)).ToList()
            });

            return Ok(result);
        }

        // GET EVENT BY ID
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<EventGetDto>> GetEvent(Guid id)
        {
            var e = await _context.Events
                .Include(e => e.Creator)
                .Include(e => e.RoomBookings).ThenInclude(rb => rb.Room)
                .Include(e => e.RoomBookings).ThenInclude(rb => rb.User)
                .FirstOrDefaultAsync(e => e.id == id);

            if (e == null)
                return NotFound();

            var dto = new EventGetDto
            {
                id = e.id,
                creator = MapUser(e.Creator),
                title = e.title,
                desc = e.desc,
                start_time = e.start_time,
                end_time = e.end_time,
                last_edited_date = e.last_edited_date,
                bookings = e.RoomBookings.Select(rb => MapRoomBooking(rb)).ToList()
            };

            return Ok(dto);
        }

        // POST
        [HttpPost]
        public async Task<ActionResult> CreateEvent([FromBody] EventPostDto dto)
        {
            // Later zal creator_username uit JWT komen
            var creator = await _context.Users.FirstOrDefaultAsync();
            if (creator == null)
                return BadRequest("No users exist to assign as creator.");

            var newEvent = new Event
            {
                id = Guid.NewGuid(),
                creator_username = creator.username,
                title = dto.title,
                desc = dto.desc,
                start_time = dto.start_time,
                end_time = dto.end_time,
                booking_id = dto.booking_id
            };

            _context.Events.Add(newEvent);
            await _context.SaveChangesAsync();

            return Ok(new { id = newEvent.id });
        }

        // PUT
        [HttpPut("{id:guid}")]
        public async Task<ActionResult> UpdateEvent(Guid id, [FromBody] EventPutDto dto)
        {
            var ev = await _context.Events.FindAsync(id);
            if (ev == null)
                return NotFound();

            if (dto.title != null) ev.title = dto.title;
            if (dto.desc != null) ev.desc = dto.desc;
            if (dto.start_time != null) ev.start_time = dto.start_time.Value;
            if (dto.end_time != null) ev.end_time = dto.end_time.Value;
            if (dto.booking_id != null) ev.booking_id = dto.booking_id;

            ev.last_edited_date = dto.last_edited_date;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE
        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> DeleteEvent(Guid id)
        {
            var ev = await _context.Events.FindAsync(id);
            if (ev == null)
                return NotFound();

            _context.Events.Remove(ev);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
