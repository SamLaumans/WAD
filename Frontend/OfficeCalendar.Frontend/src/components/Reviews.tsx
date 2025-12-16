import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import '../Styling/Reviews.css';

// Define the structure of a Review object
interface Review {
    id: string;
    event_id: string;
    username: string;
    stars: number;
    desc: string;
    creation_date: string;
}

// Define the props Reviews can receive
interface ReviewsProps {
    eventId: string;
}

const Reviews: React.FC<ReviewsProps> = ({ eventId }) => {
    // === STATE VARIABLES ===
    // Holds all reviews (fetched from backend)
    const [reviews, setReviews] = useState<Review[]>([]);

    // Keeps track of the current pagination page
    const [currentPage, setCurrentPage] = useState(0);

    // Defines how many reviews are shown per page
    const itemsPerPage = 4;

    // Form input state for adding a new review
    const [newReview, setNewReview] = useState({
        stars: 5,
        desc: '',
    });

    // FETCH REVIEWS FROM BACKEND
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch('http://localhost:5267/api/reviews/get-all');
                if (!response.ok) throw new Error('Failed to load reviews');

                const data: Review[] = await response.json();

                // Filter reviews so only reviews for this event are shown
                const eventReviews = data.filter(
                    (review) => review.event_id === eventId
                );

                setReviews(eventReviews);
                setCurrentPage(0); // Reset pagination when event changes
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, [eventId]); // Re-run when navigating to another event

    // PAGINATION LOGIC
    const offset = currentPage * itemsPerPage;
    const currentReviews = reviews.slice(offset, offset + itemsPerPage);

    // Handle page change from ReactPaginate
    const handlePageClick = (event: { selected: number }) => {
        setCurrentPage(event.selected);
    };

    // FORM HANDLERS

    // Update input values in the review form
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setNewReview((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission to add a new review
    const handleAddReview = async (element: React.FormEvent) => {
        element.preventDefault();

        // Create new review object for backend
        const reviewToAdd = {
            event_id: eventId,
            stars: Number(newReview.stars),
            desc: newReview.desc,
        };

        try {
            await fetch('http://localhost:5267/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewToAdd),
            });

            // Optimistically add review to UI
            setReviews((prev) => [
                {
                    id: crypto.randomUUID(),
                    username: 'You',
                    creation_date: new Date().toISOString(),
                    ...reviewToAdd,
                },
                ...prev,
            ]);

            // Reset form
            setNewReview({ stars: 5, desc: '' });
        } catch (err) {
            console.error('Failed to add review:', err);
        }
    };

    // RENDER COMPONENT
    return (
        <div>
            <h2>Reviews</h2>

            {/* ADD REVIEW FORM */}
            <form className="review-form" onSubmit={handleAddReview}>
                <input
                    type="number"
                    name="stars"
                    min="1"
                    max="5"
                    value={newReview.stars}
                    onChange={handleInputChange}
                    required
                />
                <textarea
                    name="desc"
                    placeholder="Write your review..."
                    value={newReview.desc}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">Add Review</button>
            </form>

            {/* REVIEWS TABLE OR LOADING TEXT */}
            {reviews.length === 0 ? (
                <p>No reviews for this event yet.</p>
            ) : (
                <>
                    {/* REVIEWS TABLE */}
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Date placed</th>
                                <th>Stars</th>
                                <th>Review</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentReviews.map((review) => (
                                <tr key={review.id}>
                                    <td>{review.username}</td>
                                    <td>
                                        {new Date(review.creation_date).toLocaleDateString()}
                                    </td>
                                    <td>{`${review.stars}/5`}</td>
                                    <td>{review.desc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* PAGINATION CONTROL */}
                    <ReactPaginate
                        previousLabel={"← Previous"}
                        nextLabel={"Next →"}
                        pageCount={Math.ceil(reviews.length / itemsPerPage)}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                        pageClassName={"page"}
                        previousClassName={"prev"}
                        nextClassName={"next"}
                        disabledClassName={"disabled"}
                    />
                </>
            )}
        </div>
    );
};

export default Reviews;