using Microsoft.EntityFrameworkCore;
using Officecalendar.Backend.Models;
using OfficeCalendar.Backend.DTOs;
using WADapi.Data;

namespace OfficeCalendar.Backend.Services
{
    public class EventService
    {
        private readonly AppDbContext _context;

        public EventService(AppDbContext context)
        {
            _context = context;
        }


        //MAPPING 
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
                    last_edited_date = rb.Event.last_edited_date,
                    bookings = null
                }
            };
        }

        private EventGetDto MapEvent(Event e)
        {
            return new EventGetDto
            {
                id = e.id,
                creator = MapUser(e.Creator),
                title = e.title,
                desc = e.desc,
                start_time = e.start_time,
                end_time = e.end_time,
                last_edited_date = e.last_edited_date,
                bookings = e.RoomBookings == null ? null : e.RoomBookings.Select(rb => MapRoomBooking(rb)).ToList()
            };
        }

        //GETS
        public Event? GetEvent(Guid id)
        {
            return _context.Events
                .Include(e => e.Creator)
                .Include(e => e.RoomBookings).ThenInclude(rb => rb.Room)
                .Include(e => e.RoomBookings).ThenInclude(rb => rb.User)
                .FirstOrDefault(e => e.id == id);
        }

        public EventGetDto? GetEventDto(Guid id)
        {
            var e = GetEvent(id);
            return e == null ? null : MapEvent(e);
        }

        public EventGetDto[] GetAllEvents()
        {
            return _context.Events
                .Include(e => e.Creator)
                .Include(e => e.RoomBookings).ThenInclude(rb => rb.Room)
                .Include(e => e.RoomBookings).ThenInclude(rb => rb.User)
                .AsNoTracking()
                .Select(e => MapEvent(e))
                .ToArray();
        }

        //CREATE
        public EventGetDto CreateEvent(EventPostDto dto, string creator_username)
        {
            var newEvent = new Event
            {
                id = Guid.NewGuid(),
                creator_username = creator_username,
                title = dto.title,
                desc = dto.desc,
                start_time = dto.start_time,
                end_time = dto.end_time,
                booking_id = dto.booking_id
            };

            _context.Events.Add(newEvent);
            _context.SaveChanges();

            return MapEvent(newEvent);
        }

        //UPDATE
        public EventGetDto UpdateEvent(Event existing, EventPutDto dto)
        {
            if (dto.title != null)
                existing.title = dto.title;

            if (dto.desc != null)
                existing.desc = dto.desc;

            if (dto.start_time != null)
                existing.start_time = dto.start_time.Value;

            if (dto.end_time != null)
                existing.end_time = dto.end_time.Value;

            if (dto.booking_id != null)
                existing.booking_id = dto.booking_id;

            existing.last_edited_date = dto.last_edited_date;

            _context.SaveChanges();

            return MapEvent(existing);
        }

        //DELETE (soft)
        public void DeleteEvent(Event e)
        {
            e.visible = false;   // soft delete
            _context.SaveChanges();
        }

    }
}
