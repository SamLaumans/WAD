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
public class RoomsController : ControllerBase
{
    private readonly RoomService _roomService;

    public RoomsController(RoomService roomService)
    {
        _roomService = roomService;
    }

    [HttpGet]
    public ActionResult<RoomGetDto> GetRoom([FromQuery] Guid roomId)
    {
        var room = _roomService.GetRoomDtoByGuid(roomId);
        if (room == null)
            return NotFound(new
            {
                statuscode = 404,
                message = $"Room not found"
            });

        // if (room.username != User.Identity.Name)
        // {
        //     return Forbid();
        // }

        // Update to role check once implemented

        return Ok(room);
    }

    [HttpGet]
    public ActionResult<RoomGetDto> GetRoomByLocation([FromQuery] string location)
    {
        var room = _roomService.GetRoomDtoByLocation(location);
        if (room == null)
            return NotFound(new
            {
                statuscode = 404,
                message = $"Room not found"
            });

        // if (room.username != User.Identity.Name)
        // {
        //     return Forbid();
        // }

        // Update to role check once implemented

        return Ok(room);
    }

    [HttpPost]
    public ActionResult<RoomGetDto> CreateRoom(RoomPostDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(
                new
                {
                    statuscode = 400,
                    message = ModelState
                });

        var response = _roomService.PostRoom(dto);

        return CreatedAtAction(nameof(GetRoom), new { roomid = response.id }, response);
    }

    [HttpDelete]
    public ActionResult<Room> DeleteRoom([FromQuery] Guid roomid)
    {
        var room = _roomService.GetRoomByGuid(roomid);
        if (room == null)
            return NotFound(new
            {
                statuscode = 404,
                message = $"Room not found"
            });

        // if (room.creator_username != User.Identity.Name)
        // {
        //     return Forbid();
        // }

        // Update to role check once implemented

        _roomService.DeleteRoom(room);

        return NoContent();
    }

    [HttpPut]
    public ActionResult<RoomGetDto> UpdateRoom([FromQuery] Guid roomid, RoomPutDto dto)
    {
        var room = _roomService.GetRoomByGuid(roomid);
        if (room == null)
            return NotFound(new
            {
                statuscode = 404,
                message = $"Room not found"
            });

        // if (room.username != User.Identity.Name)
        // {
        //     return Forbid();
        // }

        // Update to role check once implemented

        RoomGetDto updatedDto = _roomService.UpdateRoom(room, dto);

        return Ok(updatedDto);
    }
}
