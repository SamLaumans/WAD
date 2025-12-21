using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using OfficeCalendar.Backend.DTOs;
using OfficeCalendar.Backend.Services;
using Microsoft.AspNetCore.Authorization;

namespace OfficeCalendar.Backend.Controllers;

[ApiController]
[Route("api/")]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profileService;

    public ProfileController(IProfileService profileService)
    {
        _profileService = profileService;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var username = User.Identity?.Name;

        if (string.IsNullOrEmpty(username))
            return Unauthorized("User should be loggedin to get their info.");
        var fullUser = await _profileService.GetUserByUsernameAsync(username);
        if (fullUser == null)
            return NotFound("User record not found in database.");
        return Ok(fullUser);
    }
}