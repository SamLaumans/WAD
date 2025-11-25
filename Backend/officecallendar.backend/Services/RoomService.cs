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

        public Room? GetRoomByGuid(Guid roomId)
        {
            return _context.Rooms
            .Where(r => r.visible == true)
            .Include(r => r.RoomBookings)
            .FirstOrDefault(r => r.id == roomId);
        }

        public RoomGetDto? GetRoomDtoByGuid(Guid roomId)
        {
            return _context.Rooms
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
            .FirstOrDefault();
        }

        public RoomGetDto? GetRoomDtoByLocation(string location)
        {
            return _context.Rooms
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
            .FirstOrDefault();
        }

        public RoomGetDto PostRoom(RoomPostDto dto)
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
            _context.SaveChanges();

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

        public void DeleteRoom(Room room)
        {
            room.visible = false;
            _context.SaveChanges();
        }

        public RoomGetDto UpdateRoom(Room room, RoomPutDto dto)
        {
            if (!string.IsNullOrEmpty(dto.room_location))
                room.room_location = dto.room_location;

            if (dto.available is not null)
                room.available = dto.available.Value;

            if (dto.capacity is not null)
                room.capacity = dto.capacity;

            if (dto.visible is not null)
                room.visible = dto.visible.Value;

            _context.SaveChanges();

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
