using Microsoft.EntityFrameworkCore;
using Officecalendar.Backend.Models;
using OfficeCalendar.Backend.DTOs;
using WADapi.Data;

namespace OfficeCalendar.Backend.Services
{
    public class GroupService
    {
        private readonly AppDbContext _context;

        public GroupService(AppDbContext context)
        {
            _context = context;
        }

        public GroupGetDto? GetGroupById(Guid groupId)
        {
            var group = _context.Groups
                .AsNoTracking()
                .FirstOrDefault(g => g.id == groupId);

            return group == null ? null : MapToDto(group);
        }

        public List<MembershipDto>? GetMembershipForGroup(Guid groupId)
        {
            bool exists = _context.Groups.Any(g => g.id == groupId);
            if (!exists) return null;

            var memberships = _context.GroupMemberships
                .Where(m => m.group_id == groupId)
                .Select(m => new MembershipDto
                {
                    Username = m.username,
                    GroupId = m.group_id
                })
                .ToList();

            return memberships;
        }
        public GroupGetDto CreateGroup(CreateGroupDto dto)
        {
            var group = new Group
            {
                id = Guid.NewGuid(),
                name = dto.Name,
                desc = dto.Desc
            };

            _context.Groups.Add(group);
            _context.SaveChanges();

            return MapToDto(group);
        }

        public void DeleteGroup(Guid groupId)
        {
            var group = _context.Groups
                .Include(g => g.GroupMemberships)
                .FirstOrDefault(g => g.id == groupId);

            if (group == null) return;

            _context.GroupMemberships.RemoveRange(group.GroupMemberships);
            _context.Groups.Remove(group);
            _context.SaveChanges();
        }

        public GroupGetDto? UpdateGroup(GroupGetDto dto)
        {
            var group = _context.Groups.FirstOrDefault(g => g.id == dto.Id);
            if (group == null) return null;

            group.name = dto.Name;
            group.desc = dto.Desc;

            _context.SaveChanges();

            return MapToDto(group);
        }

        public bool IsUserAdmin(string username)
        {
            var user = _context.Users.FirstOrDefault(u => u.username == username);
            if (user == null) return false;

            return true;
        }

        private static GroupGetDto MapToDto(Group group)
        {
            return new GroupGetDto
            {
                Id = group.id,
                Name = group.name,
                Desc = group.desc
            };
        }
    }
}
