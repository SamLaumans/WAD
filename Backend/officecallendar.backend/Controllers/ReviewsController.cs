using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Officecalendar.Backend.Models;
using OfficeCalendar.Backend.DTOs;
using OfficeCalendar.Backend.Services;

namespace OfficeCalendar.Backend.Controllers;

[Authorize]
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
    public async Task<ActionResult<ReviewsGetDto>> GetReview([FromQuery] Guid reviewid)
    {
        var review = await _reviewService.GetByGuid(reviewid);
        if (review == null)
            return NotFound(new
            {
                statuscode = 404,
                review = $"Review with id {reviewid} not found"
            });

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
    public async Task<ActionResult<ReviewsGetDto[]>> GetReviewForUser()
    {
        var reviews = await _reviewService.GetReviewsForUser(User.Identity.Name);

        if (reviews.Length == 0)
            return NotFound(new
            {
                statuscode = 404,
                review = $"No reviews for {User.Identity.Name} found"
            });

        return Ok(reviews);
    }

    [HttpPost]
    public async Task<ActionResult<ReviewsGetDto>> CreateReview(ReviewsPostDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(
                new
                {
                    statuscode = 400,
                    review = ModelState
                });

        var response = await _reviewService.PostReview(dto, User.Identity.Name);

        return CreatedAtAction(nameof(GetReview), new { reviewid = response.id }, response);
    }

    [HttpDelete]
    public async Task<ActionResult<Review>> DeleteReview([FromQuery] Guid reviewid)
    {
        var review = await _reviewService.GetByGuid(reviewid);
        if (review == null)
            return NotFound(new
            {
                statuscode = 404,
                review = $"Review not found"
            });


        await _reviewService.DeleteReview(review);

        return NoContent();
    }

    [HttpPut("{reviewid}")]
    public async Task<ActionResult<ReviewsGetDto>> UpdateReview(Guid reviewid, ReviewsPutDto dto)

    {
        var review = await _reviewService.GetByGuid(reviewid);
        if (review == null)
            return NotFound(new
            {
                statuscode = 404,
                review = $"Review with id {reviewid} not found"
            });

        if (review.username != User.Identity.Name)
        {
            return Forbid();
        }

        await _reviewService.UpdateReview(review, dto);

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
    public async Task<ActionResult<ReviewsGetDto[]>> GetReviewsForEvent([FromQuery] Guid eventId)
    {
        var reviews = await _reviewService.GetReviewsForEvent(eventId);

        // Always return 200 OK with an array
        return Ok(reviews);
    }
}