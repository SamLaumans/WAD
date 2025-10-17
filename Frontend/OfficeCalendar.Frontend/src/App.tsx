import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SelectedEvent from './components/SelectedEvent';
import Reviews from './components/Reviews';
import WeekPlanner from './components/WeekPlanner';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Header from './components/Header';
import Registreer from './pages/register/Registreer';
import Login from './pages/login/Login';
import Forgot_Password from './pages/forgot-password/Forgot-Password';
import Main_Page from './pages/main-page/Main-Page';
import Messages from './pages/messages/Messages';
import SingleMessage from './pages/singlemessage/SingleMessage';
import Events from './pages/events/Events';
import SingleEvent from './pages/singleevent/SingleEvent';

const AppContent: React.FC = () => {
  const location = useLocation();

  const showHeaderFooter =
    location.pathname !== '/' &&
    location.pathname !== '/login' &&
    location.pathname !== '/registreer' &&
    location.pathname !== '/forgot-pw';

  return (
    <div className="app-container">
      {showHeaderFooter && <Header />}

      <main className="main-content" style={{ height: '80px' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registreer" element={<Registreer />} />
          <Route path="/forgot-pw" element={<Forgot_Password />} />
          <Route path="/main-page" element={<Main_Page />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:messageID" element={<SingleMessage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:eventID" element={<SingleEvent />} />
          <Route path="/weekplanner" element={<WeekPlanner />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/event" element={<div><SelectedEvent /><Reviews /></div>} />
        </Routes>
      </main>

      {showHeaderFooter && <Footer />}
    </div>
  );
};


const App: React.FC = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;