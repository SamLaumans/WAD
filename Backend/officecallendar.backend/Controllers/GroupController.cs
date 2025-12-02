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
    public ActionResult<GroupGetDto> GetGroupById([FromQuery] Guid groupId)
    {
        var group = _groupService.GetGroupById(groupId);

        if (group == null)
            return NotFound(new
            {
                statuscode = 404,
                message = "Group not found"
            });

        return Ok(group);
    }

    [HttpGet("Memberships")]
    public ActionResult<IEnumerable<MembershipDto>> GetMembershipForGroup([FromQuery] Guid groupId)
    {
        var memberships = _groupService.GetMembershipForGroup(groupId);

        if (memberships == null || !memberships.Any())
            return NotFound(new
            {
                statuscode = 404,
                message = "No memberships or group not found"
            });

        return Ok(memberships);
    }

    [HttpPost]
    public ActionResult<GroupGetDto> CreateGroup([FromBody] CreateGroupDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new
            {
                statuscode = 400,
                message = ModelState
            });

        var createdGroup = _groupService.CreateGroup(dto);

        return CreatedAtAction(
            nameof(GetGroupById),
            new { groupId = createdGroup.Id },
            createdGroup
        );
    }

    [HttpDelete]
    public ActionResult DeleteGroup([FromQuery] Guid groupId)
    {
        string username = User.FindFirstValue(ClaimTypes.Name);

        if (!_groupService.IsUserAdmin(username))
            return Forbid();

        var group = _groupService.GetGroupById(groupId);

        if (group == null)
            return NotFound(new
            {
                statuscode = 404,
                message = "Group not found"
            });

        _groupService.DeleteGroup(groupId);

        return NoContent();
    }

    [HttpPut]
    public ActionResult<GroupGetDto> UpdateGroup([FromBody] GroupGetDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new
            {
                statuscode = 400,
                message = ModelState
            });

        var updatedGroup = _groupService.UpdateGroup(dto);

        if (updatedGroup == null)
            return NotFound(new
            {
                statuscode = 404,
                message = "Group not found"
            });

        return Ok(updatedGroup);
    }
}
