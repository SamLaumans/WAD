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

        public Review? GetByGuid(Guid reviewId)
        {
            // Fetch a visible review and include related User + Event
            return _context.Reviews
            .Where(r => r.visible)
            .Include(m => m.User)
            .Include(r => r.Event)
            .FirstOrDefault(r => r.id == reviewId);
        }

        public ReviewsGetDto[] GetReviewsForUser(string username)
        {
            // Get all visible reviews created by user
            return _context.Reviews
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
                .AsNoTracking() // improves read performance
                .ToArray();
        }

        public ReviewsGetDto PostReview(ReviewsPostDto dto, string username)
        {
            // Create new review entity
            var review = new Review
            {
                id = Guid.NewGuid(),
                event_id = dto.event_id,
                username = username,
                stars = dto.stars,
                desc = dto.desc,
                creation_date = DateTime.UtcNow,
            };

            // Save to database
            _context.Reviews.Add(review);
            _context.SaveChanges();

            // Return DTO
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

        public void DeleteReview(Review review)
        {
            // Soft delete: mark as invisible
            review.visible = false;
            _context.SaveChanges();
        }

        public void UpdateReview(Review review, ReviewsPutDto dto)
        {
            // Update fields conditionally
            if (dto.stars.HasValue)
                review.stars = (int)dto.stars;

            if (!string.IsNullOrEmpty(dto.desc))
                review.desc = dto.desc;

            if (dto.visible is not null)
                review.visible = dto.visible.Value;

            if (dto.referenced_event_id.HasValue)
                review.referenced_event_id = dto.referenced_event_id.Value;

            // Update edit timestamp
            review.last_edited_date = DateTime.UtcNow;

            _context.SaveChanges();
        }

        public ReviewsGetDto[] GetReviewsForEvent(Guid eventId)
        {
            // Get all visible reviews for event
            return _context.Reviews
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
                .ToArray();
        }
    }
}
