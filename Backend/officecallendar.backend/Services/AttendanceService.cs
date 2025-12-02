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

        public Attendance? GetAttendanceByGuid(Guid attendanceId)
        {
            return _context.Attendances
            .Where(a => a.visible == true)
            .Include(a => a.User)
            .Include(a => a.CreatorUser)
            .FirstOrDefault(a => a.id == attendanceId);
        }

        public AttendanceGetDto? GetAttendanceDtoByGuid(Guid attendanceId)
        {
            return _context.Attendances
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
            .FirstOrDefault();
        }

        public AttendanceGetDto[] GetAttendancesForUser(string username)
        {
            return _context.Attendances
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
                .ToArray();
        }

        public AttendanceGetDto PostAttendance(AttendancePostDto dto, string creator_username)
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

            _context.Attendances.Add(attendance);
            _context.SaveChanges();

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

        public void DeleteAttendance(Attendance attendance)
        {
            attendance.visible = false;
            _context.SaveChanges();
        }

        public AttendanceGetDto UpdateAttendance(Attendance attendance, AttendancePutDto dto)
        {
            if (!string.IsNullOrEmpty(dto.username))
                attendance.username = dto.username;

            if (!string.IsNullOrEmpty(dto.status))
                attendance.status = dto.status;

            if (dto.date is not null)
                attendance.date = dto.date.Value;

            if (dto.visible is not null)
                attendance.visible = dto.visible.Value;

            _context.SaveChanges();

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
