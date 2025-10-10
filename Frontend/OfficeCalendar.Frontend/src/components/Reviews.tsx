import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';

const Reviews: React.FC = () => {
    // Simulated reviews data
    const reviews = [
        { user: 'Bommel', dateEvent: '20-07-2025', datePlaced: '20-07-2025', stars: '3/5', review: 'Event was pretty good' },
        { user: 'Bramsko', dateEvent: '20-07-2025', datePlaced: '25-07-2025', stars: '4/5', review: 'I really liked the Event' },
        { user: 'Jerome', dateEvent: '20-07-2025', datePlaced: '26-07-2025', stars: '2/5', review: 'Wat een kut event, waarom is alles in het enegls >:(' },
        { user: 'Achilles', dateEvent: '20-07-2025', datePlaced: '26-07-2025', stars: '5/5', review: 'This was the best event until now <3' },
        { user: 'IllusiveAnt599', dateEvent: '20-07-2025', datePlaced: '27-07-2025', stars: '3/5', review: 'It was Okay' },
        { user: 'Draw_Lok', dateEvent: '20-07-2025', datePlaced: '27-07-2025', stars: '4/5', review: 'Really liked the React part of React' },
        { user: 'Ryuma', dateEvent: '20-07-2025', datePlaced: '28-07-2025', stars: '5/5', review: 'Would go again' },
        { user: 'Milan', dateEvent: '20-07-2025', datePlaced: '28-07-2025', stars: '4/5', review: 'Now I can actually do some stuff in here :D' },
        { user: 'DrFeelGood0908', dateEvent: '20-07-2025', datePlaced: '27-07-2025', stars: '3/5', review: 'It was Okay' },
        { user: 'Jesus', dateEvent: '20-07-2025', datePlaced: '27-07-2025', stars: '4/5', review: 'Really liked the React part of React' },
        { user: 'Michiel de Ruijter', dateEvent: '20-07-2025', datePlaced: '28-07-2025', stars: '5/5', review: 'Would go again' },
        { user: 'HeWhoMustNotBeNamed', dateEvent: '20-07-2025', datePlaced: '28-07-2025', stars: '4/5', review: 'Now I can actually do some stuff in here :D' },
    ];

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 4; // Number of reviews per page

    // Calculate current reviews to display
    const offset = currentPage * itemsPerPage;
    const currentReviews = reviews.slice(offset, offset + itemsPerPage);

    // Handle page change
    const handlePageClick = (event: { selected: number }) => {
        setCurrentPage(event.selected);
    };

    return (
        <div>
            <h2>Reviews</h2>
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
        </div>
    );
};

export default Reviews;