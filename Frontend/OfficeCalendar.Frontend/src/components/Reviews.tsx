import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import '../Styling/Reviews.css';

// Define the structure of a Review object
interface Review {
    user: string;
    dateEvent: string;
    datePlaced: string;
    stars: number;
    review: string;
}

const Reviews: React.FC = () => {
    // === STATE VARIABLES ===
    // Holds all reviews (fetched from JSON or added manually)
    const [reviews, setReviews] = useState<Review[]>([]);

    // Keeps track of the current pagination page
    const [currentPage, setCurrentPage] = useState(0);

    // Defines how many reviews are shown per page
    const itemsPerPage = 4;

    // Form input state for adding a new review
    const [newReview, setNewReview] = useState({
        user: '',
        dateEvent: '',
        stars: 5,
        review: '',
    });

    // FETCH REVIEWS FROM JSON
    useEffect(() => {
        fetch('/data/reviews.json')
            .then((response) => {
                if (!response.ok) throw new Error('Failed to load reviews');
                return response.json();
            })
            .then((data) => setReviews(data))
            .catch((error) => console.error('Error fetching reviews:', error));
    }, []); // Empty dependency array ensures this runs only once on component mount

    // PAGINATION LOGIC
    const offset = currentPage * itemsPerPage; // Starting index for current page
    const currentReviews = reviews.slice(offset, offset + itemsPerPage); // Reviews to display on current page

    // Handle page change from ReactPaginate
    const handlePageClick = (event: { selected: number }) => {
        setCurrentPage(event.selected);
    };

    //FORM HANDLERS

    // Update input values in the review form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewReview((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission to add a new review
    const handleAddReview = async (element: React.FormEvent) => {
        element.preventDefault();

        // Create new review object
        const reviewToAdd: Review = {
            ...newReview,
            datePlaced: new Date().toISOString().split('T')[0], // Automatically set today's date
            stars: Number(newReview.stars), // Ensure stars is stored as a number
        };

        // Add new review to local state (so it displays immediately)
        const updatedReviews = [reviewToAdd, ...reviews];
        setReviews(updatedReviews);

        // Reset form fields
        setNewReview({ user: '', dateEvent: '', stars: 5, review: '' });

        // Attempt to send the new review to backend API (if available)
        try {
            await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewToAdd),
            });
        } catch (err) {
            console.warn('No backend available. Review only saved locally.');
        }
    };

    // RENDER COMPONENT
    return (
        <div>
            <h2>Reviews</h2>

            {/*ADD REVIEW FORM*/}
            <form className="review-form" onSubmit={handleAddReview}>
                <input
                    type="text"
                    name="user"
                    placeholder="Your name"
                    value={newReview.user}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="date"
                    name="dateEvent"
                    value={newReview.dateEvent}
                    onChange={handleInputChange}
                    required
                />
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
                    name="review"
                    placeholder="Write your review..."
                    value={newReview.review}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">Add Review</button>
            </form>

            {/*REVIEWS TABLE OR LOADING TEXT*/}
            {reviews.length === 0 ? (
                <p>Loading reviews...</p>
            ) : (
                <>
                    {/*EVIEWS TABLE*/}
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Date event</th>
                                <th>Date placed</th>
                                <th>Stars</th>
                                <th>Review</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentReviews.map((review, index) => (
                                <tr key={index}>
                                    <td>{review.user}</td>
                                    <td>{review.dateEvent}</td>
                                    <td>{review.datePlaced}</td>
                                    <td>{`${review.stars}/5`}</td>
                                    <td>{review.review}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/*PAGINATION CONTROL*/}
                    <ReactPaginate
                        previousLabel={"← Previous"}
                        nextLabel={"Next →"}
                        pageCount={Math.ceil(reviews.length / itemsPerPage)} // Total number of pages
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"} // Wrapper class for pagination controls
                        activeClassName={"active"} // Active page styling
                        pageClassName={"page"} // Each page number styling
                        previousClassName={"prev"} // "Previous" button styling
                        nextClassName={"next"} // "Next" button styling
                        disabledClassName={"disabled"} // Disabled state styling
                    />
                </>
            )}
        </div>
    );
};

export default Reviews;