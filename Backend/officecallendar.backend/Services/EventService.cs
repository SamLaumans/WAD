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
        private async Task<UserGetDto> MapUser(User user)
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

        private async Task<RoomBookingGetDto> MapRoomBooking(RoomBooking rb)
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
                booked_by = await MapUser(rb.User),
                visible = rb.visible,
                Event = rb.Event == null ? null : new EventGetDto
                {
                    id = rb.Event.id,
                    creator = await MapUser(rb.Event.Creator),
                    title = rb.Event.title,
                    desc = rb.Event.desc,
                    start_time = rb.Event.start_time,
                    end_time = rb.Event.end_time,
                    last_edited_date = rb.Event.last_edited_date,
                    bookings = null
                }
            };
        }

        private async Task<EventGetDto> MapEvent(Event e)
        {
            var bookingTasks = e.RoomBookings?.Select(rb => MapRoomBooking(rb)) ?? Enumerable.Empty<Task<RoomBookingGetDto>>();
            var subscriberTasks = e.EventSubscriptions?.Select(es => MapUser(es.User)) ?? Enumerable.Empty<Task<UserGetDto>>();

            return new EventGetDto
            {
                id = e.id,
                creator = await MapUser(e.Creator),
                title = e.title,
                desc = e.desc,
                start_time = e.start_time,
                end_time = e.end_time,
                last_edited_date = e.last_edited_date,
                bookings = (await Task.WhenAll(bookingTasks)).ToList(),
                subscribers = (await Task.WhenAll(subscriberTasks)).ToList()
            };
        }

        //GETS
        public async Task<Event?> GetEvent(Guid id)
        {
            return await _context.Events
                .Where(e => e.visible)
                .Include(e => e.Creator)
                .Include(e => e.RoomBookings).ThenInclude(rb => rb.Room)
                .Include(e => e.RoomBookings).ThenInclude(rb => rb.User)
                .FirstOrDefaultAsync(e => e.id == id);
        }

        public async Task<EventGetDto?> GetEventDto(Guid id)
        {
            var e = await GetEvent(id);
            return e == null ? null : await MapEvent(e);
        }

        public async Task<EventGetDto[]> GetAllEvents()
        {
            var events = await _context.Events
                .Where(e => e.visible)
                .Include(e => e.Creator)
                .Include(e => e.RoomBookings).ThenInclude(rb => rb.Room)
                .Include(e => e.RoomBookings).ThenInclude(rb => rb.User)
                .Include(e => e.EventSubscriptions).ThenInclude(es => es.User)
                .AsNoTracking()
                .ToListAsync();

            return (await Task.WhenAll(events.Select(e => MapEvent(e)))).ToArray();
        }

        public async Task<EventGetDto[]> GetMyEvents(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.username == username);
            if (user == null) return Array.Empty<EventGetDto>();

            IQueryable<Event> query = _context.Events
                .Include(e => e.Creator)
                .Include(e => e.RoomBookings).ThenInclude(rb => rb.Room)
                .Include(e => e.RoomBookings).ThenInclude(rb => rb.User)
                .Include(e => e.EventSubscriptions).ThenInclude(es => es.User)
                .AsNoTracking();

            if (user.role != 1) // Not admin
            {
                query = query.Where(e => e.visible && (e.creator_username == username || e.EventSubscriptions.Any(es => es.username == username)));
            }
            else
            {
                query = query.Where(e => e.visible); // Admin sees all
            }

            var events = await query.ToListAsync();

            return (await Task.WhenAll(events.Select(e => MapEvent(e)))).ToArray();
        }

        //CREATE
        public async Task<EventGetDto> CreateEvent(EventPostDto dto, string creator_username)
        {
            var id = Guid.NewGuid();

            var newEvent = new Event
            {
                id = id,
                creator_username = creator_username,
                title = dto.title,
                desc = dto.desc,
                start_time = dto.start_time,
                end_time = dto.end_time,
                booking_id = dto.booking_id
            };

            _context.Events.Add(newEvent);
            await _context.SaveChangesAsync();

            // Add subscriptions for invited users
            if (dto.invitedUsers != null)
            {
                foreach (var username in dto.invitedUsers)
                {
                    var user = await _context.Users.FirstOrDefaultAsync(u => u.username == username);
                    if (user != null)
                    {
                        var subscription = new EventSubscription
                        {
                            username = username,
                            event_id = id,
                            participated = null
                        };
                        _context.EventSubscriptions.Add(subscription);
                    }
                }
                await _context.SaveChangesAsync();
            }

            var savedEvent = await GetEvent(id);

            // Ensure Creator is loaded
            if (savedEvent != null)
            {
                await _context.Entry(savedEvent).Reference(e => e.Creator).LoadAsync();
            }

            return await MapEvent(savedEvent);
        }

        //UPDATE
        public async Task<EventGetDto> UpdateEvent(Event existing, EventPutDto dto)
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

            existing.last_edited_date = DateTime.UtcNow;

            // Update subscriptions
            if (dto.invitedUsers != null)
            {
                // Remove old subscriptions
                var oldSubscriptions = _context.EventSubscriptions.Where(es => es.event_id == existing.id);
                _context.EventSubscriptions.RemoveRange(oldSubscriptions);

                // Add new subscriptions
                foreach (var username in dto.invitedUsers)
                {
                    var user = await _context.Users.FirstOrDefaultAsync(u => u.username == username);
                    if (user != null)
                    {
                        var subscription = new EventSubscription
                        {
                            username = username,
                            event_id = existing.id,
                            participated = null
                        };
                        await _context.EventSubscriptions.AddAsync(subscription);
                    }
                }
            }

            _context.SaveChanges();

            return await MapEvent(existing);
        }

        //DELETE (soft)
        public async Task DeleteEvent(Event e)
        {
            e.visible = false;   // soft delete
            await _context.SaveChangesAsync();
        }

    }
}
