import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SelectedEvent from './components/SelectedEvent';
import Reviews from './components/Reviews';
import WeekPlanner from './components/WeekPlanner';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/weekplanner" element={<WeekPlanner />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route
              path="/event"
              element={
                <div>
                  <SelectedEvent />
                  <Reviews />
                </div>
              }
            />
          </Routes>
        </div>

        {/* Standard footer on all pages */}
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;