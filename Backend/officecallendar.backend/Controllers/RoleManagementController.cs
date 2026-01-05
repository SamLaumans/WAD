using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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
    [Authorize]
    public async Task<ActionResult<List<UserSearchDto>>> SearchUsers([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return Ok(new List<UserSearchDto>());

        var users = await _userService.SearchUsersByUsernameAsync(query);
        return Ok(users);
    }

    [HttpPost("AdjustRole")]
    [Authorize(Roles = "1")]
    public async Task<ActionResult<UserSearchDto>> AdjustUserRole([FromBody] AdjustRoleDto dto)
    {
        if (dto.NewRole < 0 || dto.NewRole > 1)
        {
            return BadRequest("Role must be 0(user) or 1(admin)");
        }
        var updatedUser = await _userService.ChangeUserRoleAsync(dto.Username, dto.NewRole);

        if (updatedUser == null)
            return NotFound("Gebruiker niet gevonden");

        return Ok(updatedUser);
    }
}
