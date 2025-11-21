using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Officecalendar.Backend.Models;
using OfficeCalendar.Backend.DTOs;
using OfficeCalendar.Backend.Services;

namespace OfficeCalendar.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AttendancesController : ControllerBase
{
    private readonly AttendanceService _attendanceService;

    public AttendancesController(AttendanceService attendanceService)
    {
        _attendanceService = attendanceService;
    }

    [HttpGet]
    public ActionResult<AttendanceGetDto> GetAttendance([FromQuery] Guid attendanceId)
    {
        var attendance = _attendanceService.GetAttendanceDtoByGuid(attendanceId, User.Identity.Name);
        if (attendance == null)
            return NotFound(new
            {
                statuscode = 404,
                message = $"Attendance not found"
            });

        if (attendance.username != User.Identity.Name)
        {
            return Forbid();
        }

        return Ok(attendance);
    }

    [HttpGet("me")]
    public ActionResult<AttendanceGetDto[]> GetAttendanceForUser()
    {
        var attendances = _attendanceService.GetAttendancesForUser(User.Identity.Name);

        if (attendances.Length == 0)
            return NotFound(new
            {
                statuscode = 404,
                message = $"No attendances found"
            });

        return Ok(attendances);
    }

    [HttpPost]
    public ActionResult<AttendanceGetDto> CreateAttendance(AttendancePostDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(
                new
                {
                    statuscode = 400,
                    message = ModelState
                });

        var response = _attendanceService.PostAttendance(dto, User.Identity.Name);

        return CreatedAtAction(nameof(GetAttendance), new { attendanceid = response.id }, response);
    }

    [HttpDelete]
    public ActionResult<Attendance> DeleteAttendance([FromQuery] Guid attendanceid)
    {
        var attendance = _attendanceService.GetAttendanceByGuid(attendanceid);
        if (attendance == null)
            return NotFound(new
            {
                statuscode = 404,
                message = $"Attendance not found"
            });

        if (attendance.creator_username != User.Identity.Name)
        {
            return Forbid();
        }

        _attendanceService.DeleteAttendance(attendance);

        return NoContent();
    }

    [HttpPut]
    public ActionResult<AttendanceGetDto> UpdateAttendance([FromQuery] Guid attendanceid, AttendancePutDto dto)
    {
        var attendance = _attendanceService.GetAttendanceByGuid(attendanceid);
        if (attendance == null)
            return NotFound(new
            {
                statuscode = 404,
                message = $"Attendance not found"
            });

        if (attendance.username != User.Identity.Name)
        {
            return Forbid();
        }

        AttendanceGetDto updatedDto = _attendanceService.UpdateAttendance(attendance, dto, User.Identity.Name);

        return Ok(updatedDto);
    }
}
