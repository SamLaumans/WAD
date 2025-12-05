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

    [HttpGet("SearchUsers")]
    public async Task<ActionResult<List<UserSearchDto>>> SearchUsers([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return Ok(new List<UserSearchDto>());

        var users = await _userService.SearchUsersByUsernameAsync(query);
        return Ok(users);
    }


    [HttpPost("AdjustRole")]
    public async Task<ActionResult<UserSearchDto>> AdjustUserRole([FromBody] AdjustRoleDto dto)
    {
        var updatedUser = await _userService.ChangeUserRoleAsync(dto.Username, dto.NewRole);

        if (updatedUser == null)
            return NotFound("Gebruiker niet gevonden");

        return Ok(updatedUser);
    }
}
