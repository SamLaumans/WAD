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

        public async Task<RoomBooking?> GetRoomBookingByGuid(Guid roomBookingId)
        {
            return await _context.RoomBookings
            .Where(r => r.visible == true)
            .Include(r => r.Room)
            .Include(r => r.Event)
                .ThenInclude(e => e.Creator)
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.id == roomBookingId);
        }

        public async Task<RoomBookingGetDto?> GetRoomBookingDtoByGuid(Guid roomBookingId)
        {
            return await _context.RoomBookings
            .Where(r => r.id == roomBookingId)
            .Where(r => r.visible == true)
            .Include(r => r.Room)
            .Include(r => r.Event)
                .ThenInclude(e => e.Creator)
            .Include(r => r.User)
            .Select(r => ToDto(r))
            .FirstOrDefaultAsync();
        }

        public async Task<RoomBookingGetDto[]> GetRoomBookingsForUser(string username)
        {
            return await _context.RoomBookings
                .Where(rb => rb.booked_by == username)
                .Where(rb => rb.visible == true)
                .Include(r => r.Room)
                .Include(r => r.Event)
                    .ThenInclude(e => e.Creator)
                .Include(r => r.User)
                .Select(rb => ToDto(rb))
                .AsNoTracking()
                .ToArrayAsync();
        }

        public async Task<RoomBookingGetDto> PostRoomBooking(RoomBookingPostDto dto, string username)
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
            await _context.SaveChangesAsync();

            return await _context.RoomBookings
                .Where(rb => rb.id == id)
                .Where(rb => rb.visible == true)
                .Include(r => r.Room)
                .Include(r => r.Event)
                    .ThenInclude(e => e.Creator)
                .Include(r => r.User)
                .Select(rb => ToDto(rb)).FirstAsync();
        }

        public async Task DeleteRoomBooking(RoomBooking roomBooking)
        {
            roomBooking.visible = false;
            await _context.SaveChangesAsync();
        }

        public async Task<RoomBookingGetDto> UpdateRoomBooking(RoomBooking roomBooking, RoomBookingPutDto dto)
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

            await _context.SaveChangesAsync();

            var reloaded = await _context.RoomBookings
                .Where(rb => rb.id == roomBooking.id)
                .Include(r => r.Room)
                .Include(r => r.Event)
                    .ThenInclude(e => e.Creator)
                .Include(r => r.User)
                .FirstAsync();

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

        public async Task<bool> IsTimeSlotAvailable(DateTime start, DateTime end, Guid roomId, Guid? ignoreId = null)
        {
            return !await _context.RoomBookings.AnyAsync(b => b.room_id == roomId && (ignoreId == null || b.id != ignoreId.Value) &&
            start < b.end_time && end > b.start_time);
        }

    }
}
