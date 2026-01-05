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

        public async Task<GroupGetDto?> GetGroupById(Guid groupId)
        {
            var group = await _context.Groups
                .AsNoTracking()
                .FirstOrDefaultAsync(g => g.id == groupId);

            return group == null ? null : MapToDto(group);
        }

        public async Task<List<MembershipDto>?> GetMembershipForGroup(Guid groupId)
        {
            bool exists = await _context.Groups.AnyAsync(g => g.id == groupId);
            if (!exists) return null;

            var memberships = await _context.GroupMemberships
                .Where(m => m.group_id == groupId)
                .Select(m => new MembershipDto
                {
                    Username = m.username,
                    GroupId = m.group_id
                })
                .ToListAsync();

            return memberships;
        }
        public async Task<GroupGetDto> CreateGroup(CreateGroupDto dto)
        {
            var group = new Group
            {
                id = Guid.NewGuid(),
                name = dto.Name,
                desc = dto.Desc
            };

            _context.Groups.Add(group);
            await _context.SaveChangesAsync();

            return MapToDto(group);
        }

        public async Task DeleteGroup(Guid groupId)
        {
            var group = await _context.Groups
                .Include(g => g.GroupMemberships)
                .FirstOrDefaultAsync(g => g.id == groupId);

            if (group == null) return;

            _context.GroupMemberships.RemoveRange(group.GroupMemberships);
            _context.Groups.Remove(group);
            await _context.SaveChangesAsync();
        }

        public async Task<GroupGetDto?> UpdateGroup(GroupGetDto dto)
        {
            var group = await _context.Groups.FirstOrDefaultAsync(g => g.id == dto.Id);
            if (group == null) return null;

            group.name = dto.Name;
            group.desc = dto.Desc;

            await _context.SaveChangesAsync();

            return MapToDto(group);
        }

        public async Task<bool> IsUserAdmin(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.username == username);
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
