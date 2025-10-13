import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';

const Reviews: React.FC = () => {
    // Store the reviews fetched from the JSON file
    const [reviews, setReviews] = useState<any[]>([]);

    // Keep track of the current page for pagination
    const [currentPage, setCurrentPage] = useState(0);

    // Number of reviews to display per page
    const itemsPerPage = 4;

    // 
    // Fetch reviews from JSON on mount
    // 
    useEffect(() => {
        fetch('/data/reviews.json') // Path relative to the /public folder
            .then((response) => {
                if (!response.ok) throw new Error('Failed to load reviews'); // Handle HTTP errors
                return response.json(); // Parse the JSON response
            })
            .then((data) => setReviews(data)) // Save reviews into state
            .catch((error) => console.error('Error fetching reviews:', error));
    }, []); // Empty dependency array = runs only once when the component mounts

    // 
    // Pagination logic
    // 
    const offset = currentPage * itemsPerPage; // Starting index for the current page
    const currentReviews = reviews.slice(offset, offset + itemsPerPage); // Reviews to show on the current page

    // Update current page when user clicks pagination buttons
    const handlePageClick = (event: { selected: number }) => {
        setCurrentPage(event.selected);
    };

    // 
    // Render the component
    // 
    return (
        <div>
            <h2>Reviews</h2>

            {/* Show loading text while the JSON is still being fetched */}
            {reviews.length === 0 ? (
                <p>Loading reviews...</p>
            ) : (
                <>
                    {/* Reviews Table */}
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
                                    <td>{review.stars}</td>
                                    <td>{review.review}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <ReactPaginate
                        previousLabel={"← Previous"}
                        nextLabel={"Next →"}
                        pageCount={Math.ceil(reviews.length / itemsPerPage)} // Total number of pages
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"} // Class for styling the container
                        activeClassName={"active"} // Class for active page
                        pageClassName={"page"} // Class for each page number
                        previousClassName={"prev"} // Class for "Previous" button
                        nextClassName={"next"} // Class for "Next" button
                        disabledClassName={"disabled"} // Class for disabled buttons
                    />
                </>
            )}
        </div>
    );
};

export default Reviews;