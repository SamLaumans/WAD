using Microsoft.EntityFrameworkCore;
using Officecalendar.Backend.Models;
using OfficeCalendar.Backend.DTOs;
using WADapi.Data;

namespace OfficeCalendar.Backend.Services
{
    public class RoomBookingService
    {
        private readonly AppDbContext _context;

        public RoomBookingService(AppDbContext context)
        {
            _context = context;
        }

        public RoomBooking? GetRoomBookingByGuid(Guid roomBookingId)
        {
            return _context.RoomBookings
            .Where(r => r.visible == true)
            .Include(r => r.Room)
            .Include(r => r.Event)
                .ThenInclude(e => e.Creator)
            .Include(r => r.User)
            .FirstOrDefault(r => r.id == roomBookingId);
        }

        public RoomBookingGetDto? GetRoomBookingDtoByGuid(Guid roomBookingId)
        {
            return _context.RoomBookings
            .Where(r => r.id == roomBookingId)
            .Where(r => r.visible == true)
            .Include(r => r.Room)
            .Include(r => r.Event)
                .ThenInclude(e => e.Creator)
            .Include(r => r.User)
            .Select(r => ToDto(r))
            .FirstOrDefault();
        }

        public RoomBookingGetDto[] GetRoomBookingsForUser(string username)
        {
            return _context.RoomBookings
                .Where(rb => rb.booked_by == username)
                .Where(rb => rb.visible == true)
                .Include(r => r.Room)
                .Include(r => r.Event)
                    .ThenInclude(e => e.Creator)
                .Include(r => r.User)
                .Select(rb => ToDto(rb))
                .AsNoTracking()
                .ToArray();
        }

        public RoomBookingGetDto PostRoomBooking(RoomBookingPostDto dto, string username)
        {
            Guid id = Guid.NewGuid();

            var roomBooking = new RoomBooking
            {
                id = id,
                room_id = dto.room_id,
                start_time = dto.start_time,
                end_time = dto.end_time,
                booked_by = username,
                event_id = dto.event_id,
                visible = true
            };

            _context.RoomBookings.Add(roomBooking);
            _context.SaveChanges();

            return _context.RoomBookings
                .Where(rb => rb.id == id)
                .Where(rb => rb.visible == true)
                .Include(r => r.Room)
                .Include(r => r.Event)
                    .ThenInclude(e => e.Creator)
                .Include(r => r.User)
                .Select(rb => ToDto(rb)).First();
        }

        public void DeleteRoomBooking(RoomBooking roomBooking)
        {
            roomBooking.visible = false;
            _context.SaveChanges();
        }

        public RoomBookingGetDto UpdateRoomBooking(RoomBooking roomBooking, RoomBookingPutDto dto)
        {
            if (dto.room_id is not null)
                roomBooking.room_id = dto.room_id.Value;

            if (dto.start_time is not null)
                roomBooking.start_time = dto.start_time.Value;

            if (dto.end_time is not null)
                roomBooking.end_time = dto.end_time.Value;

            if (dto.event_id is not null)
                roomBooking.event_id = dto.event_id.Value;

            if (dto.visible is not null)
                roomBooking.visible = dto.visible.Value;

            _context.SaveChanges();

            var reloaded = _context.RoomBookings
                .Where(rb => rb.id == roomBooking.id)
                .Include(r => r.Room)
                .Include(r => r.Event)
                    .ThenInclude(e => e.Creator)
                .Include(r => r.User)
                .First();

            return ToDto(reloaded);
        }

        private static RoomBookingGetDto ToDto(RoomBooking rb)
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
                booked_by = new UserGetDto
                {
                    username = rb.User.username,
                    email = rb.User.email,
                    nickname = rb.User.nickname,
                    creation_date = rb.User.creation_date,
                    role = rb.User.role
                },
                Event = rb.Event == null ? null : new EventGetDto
                {
                    id = rb.Event.id,
                    creator = new UserGetDto
                    {
                        username = rb.Event.Creator.username,
                        email = rb.Event.Creator.email,
                        nickname = rb.Event.Creator.nickname,
                        creation_date = rb.Event.Creator.creation_date,
                        role = rb.Event.Creator.role
                    },
                    title = rb.Event.title,
                    desc = rb.Event.desc,
                    start_time = rb.Event.start_time,
                    end_time = rb.Event.end_time,
                    last_edited_date = rb.Event.last_edited_date,
                },
                visible = rb.visible
            };
        }

        public bool IsTimeSlotAvailable(DateTime start, DateTime end, Guid roomId, Guid? ignoreId = null)
        {
            return !_context.RoomBookings.Any(b => b.room_id == roomId && (ignoreId == null || b.id != ignoreId.Value) &&
            start < b.end_time && end > b.start_time);
        }

    }
}
