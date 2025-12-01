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
    public ActionResult<ReviewsGetDto> GetReview([FromQuery] Guid reviewid)
    {
        var review = _reviewService.GetByGuid(reviewid);
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
    public ActionResult<ReviewsGetDto[]> GetReviewForUser()
    {
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
        if (!ModelState.IsValid)
            return BadRequest(
                new
                {
                    statuscode = 400,
                    review = ModelState
                });

        var response = _reviewService.PostReview(dto, User.Identity.Name);

        return CreatedAtAction(nameof(GetReview), new { reviewid = response.id }, response);
    }

    [HttpDelete]
    public ActionResult<Review> DeleteReview([FromQuery] Guid reviewid)
    {
        var review = _reviewService.GetByGuid(reviewid);
        if (review == null)
            return NotFound(new
            {
                statuscode = 404,
                review = $"Review not found"
            });

        if (review.username != User.Identity.Name)
        {
            return Forbid();
        }

        _reviewService.DeleteReview(review);

        return NoContent();
    }

    [HttpPut]
    public ActionResult<ReviewsGetDto> UpdateReview([FromQuery] Guid reviewid, ReviewsPutDto dto)
    {
        var review = _reviewService.GetByGuid(reviewid);
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

        _reviewService.UpdateReview(review, dto);

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
}
