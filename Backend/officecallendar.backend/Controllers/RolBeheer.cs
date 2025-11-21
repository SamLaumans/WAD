using Microsoft.AspNetCore.Mvc;
using OfficeCalendar.Backend.DTOs;
using OfficeCalendar.Backend.Services;
using Officecalendar.Backend.Models;

namespace OfficeCalendar.Backend.Controllers;

[ApiController]
[Route("api/")]
public class RolBeheerController : ControllerBase
{
    private readonly IUserService _userService;

    public RolBeheerController(IUserService userService)
    {
        _userService = userService;
    }

    // GET: api/ListUsers
    [HttpGet("ListUsers")]
    public async Task<ActionResult<List<UserSearchDto>>> GetListOfUsersRealTime()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    // POST: api/AdjustRole
    [HttpPost("AdjustRole")]
    public async Task<ActionResult<UserSearchDto>> AdjustUserRole([FromBody] AdjustRoleDto dto)
    {
        var updatedUser = await _userService.ChangeUserRoleAsync(dto.Username, dto.NewRole);

        if (updatedUser == null)
            return NotFound("Gebruiker niet gevonden");

        return Ok(updatedUser);
    }
}
