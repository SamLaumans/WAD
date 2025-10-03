using Microsoft.AspNetCore.Mvc;
using OfficeCalendar.Backend.DTOs;
using OfficeCalendar.Backend.Services;

namespace OfficeCalendar.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController()
    {
        _authService = new AuthService(); // later you’ll inject via DI
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var response = _authService.Login(request);
        Console.WriteLine("trying endpoint");

        if (!response.Success)
            return Unauthorized(response);

        return Ok(response);
    }
}
