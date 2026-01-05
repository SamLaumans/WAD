using Microsoft.EntityFrameworkCore;
using Officecalendar.Backend.Models;
using OfficeCalendar.Backend.DTOs;
using WADapi.Data;

namespace OfficeCalendar.Backend.Services
{
    public class RoomService
    {
        private readonly AppDbContext _context;

        public RoomService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Room?> GetRoomByGuid(Guid roomId)
        {
            return await _context.Rooms
            .Where(r => r.visible == true)
            .Include(r => r.RoomBookings)
            .FirstOrDefaultAsync(r => r.id == roomId);
        }

        public async Task<RoomGetDto?> GetRoomDtoByGuid(Guid roomId)
        {
            return await _context.Rooms
            .Where(r => r.id == roomId)
            .Where(r => r.visible == true)
            .Select(r => new RoomGetDto
            {
                id = r.id,
                room_location = r.room_location,
                available = r.available,
                capacity = r.capacity,
                visible = r.visible,
            })
            .FirstOrDefaultAsync();
        }

        public async Task<RoomGetDto?> GetRoomDtoByLocation(string location)
        {
            return await _context.Rooms
            .Where(r => r.visible == true)
            .Where(r => EF.Functions.Like(r.room_location.ToLower(), $"%{location.ToLower()}%"))
            .Include(r => r.RoomBookings)
            .Select(r => new RoomGetDto
            {
                id = r.id,
                room_location = r.room_location,
                available = r.available,
                capacity = r.capacity,
                visible = r.visible
            })
            .FirstOrDefaultAsync();
        }

        public async Task<RoomGetDto> PostRoom(RoomPostDto dto)
        {
            DateTime date = DateTime.UtcNow;

            var room = new Room
            {
                id = Guid.NewGuid(),
                room_location = dto.room_location,
                available = dto.available,
                capacity = dto.capacity,
                visible = true
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            var roomDto = new RoomGetDto
            {
                id = room.id,
                room_location = room.room_location,
                available = room.available,
                capacity = room.capacity,
                visible = room.visible
            };

            return roomDto;
        }

        public async Task DeleteRoom(Room room)
        {
            room.visible = false;
            await _context.SaveChangesAsync();
        }

        public async Task<RoomGetDto> UpdateRoom(Room room, RoomPutDto dto)
        {
            if (!string.IsNullOrEmpty(dto.room_location))
                room.room_location = dto.room_location;

            if (dto.available is not null)
                room.available = dto.available.Value;

            if (dto.capacity is not null)
                room.capacity = dto.capacity;

            if (dto.visible is not null)
                room.visible = dto.visible.Value;

            await _context.SaveChangesAsync();

            return new RoomGetDto
            {
                id = room.id,
                room_location = room.room_location,
                available = room.available,
                capacity = room.capacity,
                visible = room.visible
            };
        }
    }
}
