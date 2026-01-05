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
public class AttendanceController : ControllerBase
{
    private readonly AttendanceService _attendanceService;

    public AttendanceController(AttendanceService attendanceService)
    {
        _attendanceService = attendanceService;
    }

    [HttpGet]
    public async Task<ActionResult<AttendanceGetDto>> GetAttendance([FromQuery] Guid attendanceId)
    {
        var attendance = await _attendanceService.GetAttendanceDtoByGuid(attendanceId);
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
    public async Task<ActionResult<AttendanceGetDto[]>> GetAttendanceForUser()
    {
        var attendances = await _attendanceService.GetAttendancesForUser(User.Identity.Name);

        if (attendances.Length == 0)
            return NotFound(new
            {
                statuscode = 404,
                message = $"No attendances found"
            });

        return Ok(attendances);
    }

    [HttpPost]
    public async Task<ActionResult<AttendanceGetDto>> CreateAttendance(AttendancePostDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(
                new
                {
                    statuscode = 400,
                    message = ModelState
                });

        var response = await _attendanceService.PostAttendance(dto, User.Identity.Name);

        return CreatedAtAction(nameof(GetAttendance), new { attendanceid = response.id }, response);
    }

    [HttpDelete]
    public async Task<ActionResult<Attendance>> DeleteAttendance([FromQuery] Guid attendanceid)
    {
        var attendance = await _attendanceService.GetAttendanceByGuid(attendanceid);
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
    public async Task<ActionResult<AttendanceGetDto>> UpdateAttendance([FromQuery] Guid attendanceid, AttendancePutDto dto)
    {
        var attendance = await _attendanceService.GetAttendanceByGuid(attendanceid);
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

        AttendanceGetDto updatedDto = await _attendanceService.UpdateAttendance(attendance, dto);

        return Ok(updatedDto);
    }
}
