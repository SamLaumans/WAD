import React from 'react';

// The SelectedEvent component displays detailed information about
// a single selected event. It currently uses a hardcoded event object,
// but could later receive event data as props or from context/state.
const SelectedEvent: React.FC = () => {
    // Temporary hardcoded event data — in the future, this could come from
    // an API call, a global state (e.g. Redux, Context), or route parameters.
    const event = {
        title: 'WebDev React les 10',
        place: 'Hogeschool Rotterdam',
        date: '20-07-2025',
        time: '13:30 - 16:30',
        description: 'Attendence necessary. Make sure to have created a React component. 1 per person',
    };

    return (
        <div>
            {/* Page heading and short explanation */}
            <h2>Selected Event</h2>
            <p>Here you can see more information about the selected event.</p>

            {/* Table displaying event details */}
            <table>
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Place</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Description</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        {/* Each table cell displays one property from the event object */}
                        <td>{event.title}</td>
                        <td>{event.place}</td>
                        <td>{event.date}</td>
                        <td>{event.time}</td>
                        <td>{event.description}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default SelectedEvent;