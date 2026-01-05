using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Officecalendar.Backend.Models;
using OfficeCalendar.Backend.DTOs;
using OfficeCalendar.Backend.Services;
using System.Security.Claims;

namespace OfficeCalendar.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class GroupController : ControllerBase
{
    private readonly GroupService _groupService;

    public GroupController(GroupService groupService)
    {
        _groupService = groupService;
    }

    [HttpGet]
    public async Task<ActionResult<GroupGetDto>> GetGroupById([FromQuery] Guid groupId)
    {
        var group = await _groupService.GetGroupById(groupId);

        if (group == null)
            return NotFound(new
            {
                statuscode = 404,
                message = "Group not found"
            });

        return Ok(group);
    }

    [HttpGet("Memberships")]
    public async Task<ActionResult<IEnumerable<MembershipDto>>> GetMembershipForGroup([FromQuery] Guid groupId)
    {
        var memberships = await _groupService.GetMembershipForGroup(groupId);

        if (memberships == null || !memberships.Any())
            return NotFound(new
            {
                statuscode = 404,
                message = "No memberships or group not found"
            });

        return Ok(memberships);
    }

    [HttpPost]
    public async Task<ActionResult<GroupGetDto>> CreateGroup([FromBody] CreateGroupDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new
            {
                statuscode = 400,
                message = ModelState
            });

        var createdGroup = await _groupService.CreateGroup(dto);

        return CreatedAtAction(
            nameof(GetGroupById),
            new { groupId = createdGroup.Id },
            createdGroup
        );
    }

    [HttpDelete]
    public async Task<ActionResult> DeleteGroup([FromQuery] Guid groupId)
    {
        string username = User.FindFirstValue(ClaimTypes.Name);

        if (!await _groupService.IsUserAdmin(username))
            return Forbid();

        var group = await _groupService.GetGroupById(groupId);

        if (group == null)
            return NotFound(new
            {
                statuscode = 404,
                message = "Group not found"
            });

        await _groupService.DeleteGroup(groupId);

        return NoContent();
    }

    [HttpPut]
    public async Task<ActionResult<GroupGetDto>> UpdateGroup([FromBody] GroupGetDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new
            {
                statuscode = 400,
                message = ModelState
            });

        var updatedGroup = await _groupService.UpdateGroup(dto);

        if (updatedGroup == null)
            return NotFound(new
            {
                statuscode = 404,
                message = "Group not found"
            });

        return Ok(updatedGroup);
    }
}
