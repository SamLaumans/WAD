using Microsoft.EntityFrameworkCore;
using Officecalendar.Backend.Models;
using OfficeCalendar.Backend.DTOs;
using WADapi.Data;

namespace OfficeCalendar.Backend.Services
{
    public class ReviewService
    {
        private readonly AppDbContext _context;

        public ReviewService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Review?> GetByGuid(Guid reviewId)
        {
            return await _context.Reviews
            .Where(r => r.visible)
            .Include(m => m.User)
            .Include(r => r.Event)
            .FirstOrDefaultAsync(r => r.id == reviewId);
        }

        public async Task<ReviewsGetDto[]> GetReviewsForUser(string username)
        {
            return await _context.Reviews
                .Where(r => r.username == username)
                .Where(m => m.visible == true)
                .Select(m => new ReviewsGetDto
                {
                    id = m.id,
                    event_id = m.event_id,
                    username = m.username,
                    stars = m.stars,
                    desc = m.desc,
                    creation_date = m.creation_date,
                    last_edited_date = m.last_edited_date
                })
                .AsNoTracking()
                .ToArrayAsync();
        }

        public async Task<ReviewsGetDto> PostReview(ReviewsPostDto dto, string username)
        {
            var review = new Review
            {
                id = Guid.NewGuid(),
                event_id = dto.event_id,
                username = username,
                stars = dto.stars,
                desc = dto.desc,
                creation_date = DateTime.UtcNow,
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            var reviewDto = new ReviewsGetDto
            {
                id = review.id,
                event_id = review.event_id,
                username = review.username,
                stars = review.stars,
                desc = review.desc,
                creation_date = review.creation_date,
                last_edited_date = review.last_edited_date
            };

            return reviewDto;

        }

        public async Task DeleteReview(Review review)
        {
            review.visible = false;
            await _context.SaveChangesAsync();
        }

        public async Task UpdateReview(Review review, ReviewsPutDto dto)
        {
            if (dto.stars.HasValue)
                review.stars = (int)dto.stars;

            if (!string.IsNullOrEmpty(dto.desc))
                review.desc = dto.desc;

            if (dto.visible is not null)
                review.visible = dto.visible.Value;

            if (dto.referenced_event_id.HasValue)
                review.referenced_event_id = dto.referenced_event_id.Value;

            review.last_edited_date = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }
        public async Task<ReviewsGetDto[]> GetReviewsForEvent(Guid eventId)
        {
            return await _context.Reviews
                .Where(r => r.event_id == eventId)
                .Where(r => r.visible)
                .Select(r => new ReviewsGetDto
                {
                    id = r.id,
                    event_id = r.event_id,
                    username = r.username,
                    stars = r.stars,
                    desc = r.desc,
                    creation_date = r.creation_date,
                    last_edited_date = r.last_edited_date
                })
                .AsNoTracking()
                .ToArrayAsync();
        }
    }
}
