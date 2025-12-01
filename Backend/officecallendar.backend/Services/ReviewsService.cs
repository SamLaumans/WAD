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
            return _context.Reviews
            .Include(m => m.User)
            .Include(r => r.Event)
            .FirstOrDefault(r => r.id == reviewId);
        }

        public ReviewsGetDto[] GetReviewsForUser(string username)
        {
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
                .AsNoTracking()
                .ToArray();
        }

        public ReviewsGetDto PostReview(ReviewsPostDto dto, string username)
        {
            var review = new Review
            {
                id = Guid.NewGuid(),
                event_id = dto.event_id,
                username = dto.username,
                stars = dto.stars,
                desc = dto.desc,
                creation_date = DateTime.UtcNow,
            };

            _context.Reviews.Add(review);
            _context.SaveChanges();

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
            review.visible = false;
            _context.SaveChanges();
        }

        public void UpdateReview(Review review, ReviewsPutDto dto)
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

            _context.SaveChanges();
        }
    }
}
