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
    last_edited_date?: string | null;
}

// Props for Reviews component
interface ReviewsProps {
    eventId: string;
}

const Reviews: React.FC<ReviewsProps> = ({ eventId }) => {
    // All reviews for this event
    const [reviews, setReviews] = useState<Review[]>([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    // New review form state
    const [newReview, setNewReview] = useState({
        stars: 5,
        desc: '',
    });

    // Editing state (which review is being edited)
    const [editingReview, setEditingReview] = useState<Review | null>(null);

    // Edit form data
    const [editData, setEditData] = useState({ stars: 5, desc: '' });

    // Extract current user and role from JWT token
    const token = localStorage.getItem("token");
    let currentUser: string | null = null;
    let userRole: number | null = null;

    if (token) {
        try {
            // Decode JWT payload
            const payload = JSON.parse(atob(token.split('.')[1]));

            // Extract username from common JWT fields
            currentUser = payload.unique_name || payload.name || payload.sub || null;

            // Extract role (admin = 1)
            userRole = payload.role !== undefined ? parseInt(payload.role) : null;
        } catch {
            // If token is invalid or corrupted
            currentUser = null;
            userRole = null;
        }
    }

    // Fetch all reviews for this event from backend
    const fetchReviews = async () => {
        try {
            const response = await fetch(
                `http://localhost:5267/api/Reviews/get-all?eventId=${eventId}`,
                {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                }
            );

            if (!response.ok) throw new Error('Failed to fetch reviews');

            const data: Review[] = await response.json();

            setReviews(data);
            setCurrentPage(0); // Reset pagination when new data arrives
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    // Fetch reviews whenever eventId changes
    useEffect(() => {
        if (eventId) {
            fetchReviews();
        }
    }, [eventId]);

    // Pagination calculations
    const offset = currentPage * itemsPerPage;
    const currentReviews = reviews.slice(offset, offset + itemsPerPage);

    // Handle page change from ReactPaginate
    const handlePageClick = (event: { selected: number }) => {
        setCurrentPage(event.selected);
    };

    // Handle input changes for new review form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewReview((prev) => ({ ...prev, [name]: value }));
    };

    // Submit new review to backend
    const handleAddReview = async (e: React.FormEvent) => {
        e.preventDefault();

        const reviewToAdd = {
            event_id: eventId,
            stars: Number(newReview.stars),
            desc: newReview.desc,
        };

        try {
            const response = await fetch('http://localhost:5267/api/Reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(reviewToAdd),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Failed to post review:", errorText);
                return;
            }

            // Add newly created review to state
            const createdReview: Review = await response.json();
            setReviews((prev) => [createdReview, ...prev]);

            // Reset form
            setNewReview({ stars: 5, desc: '' });
            setCurrentPage(0);
        } catch (err) {
            console.error(err);
        }
    };

    // Begin editing a review
    const startEditing = (review: Review) => {
        setEditingReview(review);
        setEditData({ stars: review.stars, desc: review.desc });
    };

    // Submit updated review to backend
    const handleUpdateReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingReview) return;

        const updatedReview = {
            id: editingReview.id,
            stars: editData.stars,
            desc: editData.desc,
        };

        try {
            const response = await fetch(
                `http://localhost:5267/api/Reviews/${editingReview.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify(updatedReview),
                }
            );

            if (!response.ok) {
                console.error("Failed to update review");
                return;
            }

            const updated = await response.json();

            // Replace updated review in state
            setReviews((prev) =>
                prev.map((r) => (r.id === updated.id ? updated : r))
            );

            setEditingReview(null); // Close edit form
        } catch (err) {
            console.error(err);
        }
    };

    // Delete a review
    const handleDeleteReview = async (reviewId: string) => {
        if (!window.confirm("Weet je zeker dat je deze review wilt verwijderen?")) return;

        try {
            const response = await fetch(
                `http://localhost:5267/api/Reviews?reviewid=${reviewId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                console.error("Failed to delete review");
                return;
            }

            // Remove review from state
            setReviews(prev => prev.filter(r => r.id !== reviewId));
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div>
            <h2>Reviews</h2>

            {/* Form to add a new review */}
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

            {/* Edit review form (only visible when editingReview is set) */}
            {editingReview && (
                <form className="review-form" onSubmit={handleUpdateReview}>
                    <h3>Edit your review</h3>

                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={editData.stars}
                        onChange={(e) => setEditData({ ...editData, stars: Number(e.target.value) })}
                        required
                    />

                    <textarea
                        value={editData.desc}
                        onChange={(e) => setEditData({ ...editData, desc: e.target.value })}
                        required
                    />

                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setEditingReview(null)}>Cancel</button>
                </form>
            )}

            {/* Reviews table */}
            {reviews.length === 0 ? (
                <p>No reviews for this event yet.</p>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Date placed</th>
                                <th>Stars</th>
                                <th>Review</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentReviews.map((review) => (
                                <tr key={review.id}>
                                    <td>{review.username}</td>
                                    <td>{new Date(review.creation_date).toLocaleDateString()}</td>
                                    <td>{`${review.stars}/5`}</td>
                                    <td>{review.desc}</td>

                                    {/* Show delete for owner or admin; edit only for owner */}
                                    <td>
                                        {(review.username === currentUser || userRole === 1) && (
                                            <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
                                        )}
                                        {review.username === currentUser && (
                                            <button onClick={() => startEditing(review)}>Edit</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination component */}
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
