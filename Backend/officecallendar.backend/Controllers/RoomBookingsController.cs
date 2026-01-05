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
public class RoomBookingsController : ControllerBase
{
    private readonly RoomBookingService _roomBookingService;

    public RoomBookingsController(RoomBookingService roomBookingService)
    {
        _roomBookingService = roomBookingService;
    }

    [HttpGet]
    public async Task<ActionResult<RoomBookingGetDto>> GetRoomBooking([FromQuery] Guid roomBookingId)
    {
        var roomBooking = await _roomBookingService.GetRoomBookingDtoByGuid(roomBookingId);
        if (roomBooking == null)
            return NotFound(new
            {
                statuscode = 404,
                message = $"RoomBooking not found"
            });

        // if (roomBooking.username != User.Identity.Name)
        // {
        //     return Forbid();
        // }

        // Update to role check once implemented

        return Ok(roomBooking);
    }

    [HttpGet("me")]
    public async Task<ActionResult<RoomBookingGetDto>> GetRoomBookingsForUser()
    {
        var roomBooking = await _roomBookingService.GetRoomBookingsForUser(User.Identity.Name);
        if (roomBooking == null)
            return NotFound(new
            {
                statuscode = 404,
                message = $"RoomBookings not found"
            });

        return Ok(roomBooking);
    }

    [HttpPost]
    public async Task<ActionResult<RoomBookingGetDto>> CreateRoomBooking(RoomBookingPostDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(
                new
                {
                    statuscode = 400,
                    message = ModelState
                });

        if (!await _roomBookingService.IsTimeSlotAvailable(dto.start_time, dto.end_time, dto.room_id))
        {
            return Conflict(new
            {
                statuscode = 409,
                message = "Time slot overlaps with an existing room booking."
            });
        }
        var response = await _roomBookingService.PostRoomBooking(dto, User.Identity.Name);

        return CreatedAtAction(nameof(GetRoomBooking), new { roomBookingid = response.id }, response);
    }

    [HttpDelete]
    public async Task<ActionResult<RoomBooking>> DeleteRoomBooking([FromQuery] Guid roomBookingid)
    {
        var roomBooking = await _roomBookingService.GetRoomBookingByGuid(roomBookingid);
        if (roomBooking == null)
            return NotFound(new
            {
                statuscode = 404,
                message = $"RoomBooking not found"
            });

        // if (roomBooking.creator_username != User.Identity.Name)
        // {
        //     return Forbid();
        // }

        // Update to role check once implemented

        await _roomBookingService.DeleteRoomBooking(roomBooking);

        return NoContent();
    }

    [HttpPut]
    public async Task<ActionResult<RoomBookingGetDto>> UpdateRoomBooking([FromQuery] Guid roomBookingid, RoomBookingPutDto dto)
    {
        var roomBooking = await _roomBookingService.GetRoomBookingByGuid(roomBookingid);
        if (roomBooking == null)
            return NotFound(new
            {
                statuscode = 404,
                message = $"RoomBooking not found"
            });

        var newStart = dto.start_time ?? roomBooking.start_time;
        var newEnd = dto.end_time ?? roomBooking.end_time;
        var roomId = dto.room_id ?? roomBooking.room_id;

        if (!await _roomBookingService.IsTimeSlotAvailable(newStart, newEnd, roomId, roomBooking.id))
        {
            return Conflict(new
            {
                statuscode = 409,
                message = "Time slot overlaps with an existing room booking."
            });
        }

        // if (roomBooking.username != User.Identity.Name)
        // {
        //     return Forbid();
        // }

        // Update to role check once implemented

        RoomBookingGetDto updatedDto = await _roomBookingService.UpdateRoomBooking(roomBooking, dto);

        return Ok(updatedDto);
    }
}
