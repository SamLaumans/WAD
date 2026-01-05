using Microsoft.EntityFrameworkCore;
using Officecalendar.Backend.Models;
using OfficeCalendar.Backend.DTOs;
using WADapi.Data;

namespace OfficeCalendar.Backend.Services
{
    public class AttendanceService
    {
        private readonly AppDbContext _context;

        public AttendanceService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Attendance?> GetAttendanceByGuid(Guid attendanceId)
        {
            return await _context.Attendances
            .Where(a => a.visible == true)
            .Include(a => a.User)
            .Include(a => a.CreatorUser)
            .FirstOrDefaultAsync(a => a.id == attendanceId);
        }

        public async Task<AttendanceGetDto?> GetAttendanceDtoByGuid(Guid attendanceId)
        {
            return await _context.Attendances
            .Where(a => a.id == attendanceId)
            .Where(a => a.visible == true)
            .Select(a => new AttendanceGetDto
            {
                id = a.id,
                username = a.username,
                creator_username = a.creator_username,
                date = a.date,
                status = a.status
            })
            .FirstOrDefaultAsync();
        }

        public async Task<AttendanceGetDto[]> GetAttendancesForUser(string username)
        {
            return await _context.Attendances
                .Where(a => a.username == username)
                .Where(a => a.visible == true)
                .Select(a => new AttendanceGetDto
                {
                    id = a.id,
                    username = a.username,
                    creator_username = a.creator_username,
                    date = a.date,
                    status = a.status
                })
                .AsNoTracking()
                .ToArrayAsync();
        }

        public async Task<AttendanceGetDto> PostAttendance(AttendancePostDto dto, string creator_username)
        {
            DateTime date = DateTime.UtcNow;

            var attendance = new Attendance
            {
                id = Guid.NewGuid(),
                username = dto.username,
                creator_username = creator_username,
                date = date,
                status = dto.status
            };

            await _context.Attendances.AddAsync(attendance);
            await _context.SaveChangesAsync();

            var attendanceDto = new AttendanceGetDto
            {
                id = attendance.id,
                creator_username = creator_username,
                username = dto.username,
                date = date,
                status = dto.status
            };

            return attendanceDto;
        }

        public async Task DeleteAttendance(Attendance attendance)
        {
            attendance.visible = false;
            await _context.SaveChangesAsync();
        }

        public async Task<AttendanceGetDto> UpdateAttendance(Attendance attendance, AttendancePutDto dto)
        {
            if (!string.IsNullOrEmpty(dto.username))
                attendance.username = dto.username;

            if (!string.IsNullOrEmpty(dto.status))
                attendance.status = dto.status;

            if (dto.date is not null)
                attendance.date = dto.date.Value;

            if (dto.visible is not null)
                attendance.visible = dto.visible.Value;

            await _context.SaveChangesAsync();

            return new AttendanceGetDto
            {
                id = attendance.id,
                username = attendance.username,
                creator_username = attendance.creator_username,
                date = attendance.date,
                status = attendance.status
            };
        }
    }
}
