using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Officecalendar.Backend.Models;
using OfficeCalendar.Backend.DTOs;
using OfficeCalendar.Backend.Services;

namespace OfficeCalendar.Backend.Controllers;

[Authorize] // Require authentication for all endpoints unless overridden
[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly ReviewService _reviewService;

    public ReviewsController(ReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet]
    public ActionResult<ReviewsGetDto> GetReview([FromQuery] Guid reviewid)
    {
        // Fetch review by GUID
        var review = _reviewService.GetByGuid(reviewid);
        if (review == null)
            return NotFound(new
            {
                statuscode = 404,
                review = $"Review with id {reviewid} not found"
            });

        // Map entity to DTO
        var dto = new ReviewsGetDto
        {
            id = review.id,
            event_id = review.event_id,
            username = review.username,
            stars = review.stars,
            desc = review.desc,
            creation_date = review.creation_date,
            last_edited_date = review.last_edited_date
        };

        return Ok(dto);
    }

    [HttpGet("me")]
    public ActionResult<ReviewsGetDto[]> GetReviewForUser()
    {
        // Get reviews belonging to the logged-in user
        var reviews = _reviewService.GetReviewsForUser(User.Identity.Name);

        if (reviews.Length == 0)
            return NotFound(new
            {
                statuscode = 404,
                review = $"No reviews for {User.Identity.Name} found"
            });

        return Ok(reviews);
    }

    [HttpPost]
    public ActionResult<ReviewsGetDto> CreateReview(ReviewsPostDto dto)
    {
        // Validate model state
        if (!ModelState.IsValid)
            return BadRequest(
                new
                {
                    statuscode = 400,
                    review = ModelState
                });

        // Create new review via service
        var response = _reviewService.PostReview(dto, User.Identity.Name);

        // Return 201 Created with location header
        return CreatedAtAction(nameof(GetReview), new { reviewid = response.id }, response);
    }

    [HttpDelete]
    public ActionResult<Review> DeleteReview([FromQuery] Guid reviewid)
    {
        // Fetch the review
        var review = _reviewService.GetByGuid(reviewid);
        if (review == null)
            return NotFound(new
            {
                statuscode = 404,
                review = $"Review not found"
            });

        // Only owner can delete review
        if (review.username != User.Identity.Name)
        {
            return Forbid();
        }

        // Soft delete (set visible = false)
        _reviewService.DeleteReview(review);

        return NoContent(); // 204
    }

    [HttpPut]
    public ActionResult<ReviewsGetDto> UpdateReview([FromQuery] Guid reviewid, ReviewsPutDto dto)
    {
        // Fetch review to update
        var review = _reviewService.GetByGuid(reviewid);
        if (review == null)
            return NotFound(new
            {
                statuscode = 404,
                review = $"Review with id {reviewid} not found"
            });

        // Only owner can update
        if (review.username != User.Identity.Name)
        {
            return Forbid();
        }

        // Perform update
        _reviewService.UpdateReview(review, dto);

        // Map to DTO
        var updatedDto = new ReviewsGetDto
        {
            id = review.id,
            event_id = review.event_id,
            username = review.username,
            stars = review.stars,
            desc = review.desc,
            creation_date = review.creation_date,
            last_edited_date = review.last_edited_date
        };

        return Ok(updatedDto);
    }

    [HttpGet("get-all")]
    public ActionResult<ReviewsGetDto[]> GetReviewsForEvent([FromQuery] Guid eventId)
    {
        // Fetch all visible reviews for event
        var reviews = _reviewService.GetReviewsForEvent(eventId);

        if (reviews.Length == 0)
            return NotFound(new
            {
                statuscode = 404,
                review = $"No reviews found for event with id {eventId}"
            });

        return Ok(reviews);
    }
}