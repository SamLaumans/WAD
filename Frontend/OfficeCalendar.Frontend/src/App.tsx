import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SelectedEvent from './components/SelectedEvent';
import Reviews from './components/Reviews';
import WeekPlanner from './components/WeekPlanner';
import MonthPlanner from "./components/MonthPlanner";
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import Toolbar from './pages/toolbar/Toolbar';
import Registreer from './pages/register/Registreer';
import Login from './pages/login/Login';
import Forgot_Password from './pages/forgot-password/Forgot-Password';
import Main_Page from './pages/main-page/Main-Page';
import CreateEvent from './pages/create-event/Event';
import AdminPanel from './pages/admin-panel/AdminPanel';
import Profiel from "./pages/profile-page/profiel";
import AdminRolBeheer from "./pages/admin-role-adjustment/admin-role-adjustment";
//import EventModal from "./pages/create-event/EventModal";
import Events from './pages/events/Events';
import SingleEvent from './pages/singleevent/SingleEvent';
import DayPlanner from "./components/DayPlanner";
import MonthDayView from "./components/MonthDayView";
import About from "./components/About"
import SelectedEvent2 from "./components/SelectedEventWithReviews"
import AdminRoutes from"./components/AdminRoutes.tsx";
import LoggedinRoutes from"./components/LoggedinRoutes.tsx";
import Unauthorized from "./pages/unauthorized/unauthorized";

const AppContent: React.FC = () => {
  const location = useLocation();

  const showHeaderFooter =
    location.pathname !== '/login' &&
    location.pathname !== '/registreer' &&
    location.pathname !== '/forgot-pw' &&
    location.pathname !== '/unauthorized';

const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  setLoading(true);
  const token = localStorage.getItem('token');
  if (token) {
    fetch('http://localhost:5267/api/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
      if (res.ok) return res.json();
      throw new Error('Not authenticated');
    })
    .then(data => {
      setUser(data);
      setLoading(false);
    })
    .catch(() => {
      setUser(null);
      setLoading(false);
    });
  } else {
    setUser(null);
    setLoading(false);
  }
}, []);


  return (
    <div className="app-container">
      {showHeaderFooter && <Toolbar />}


      <main className="main-content" style={{ height: '80px' }}>
        <Routes>  
           {/* Routes that are accesible for admins only */}
          <Route element ={<AdminRoutes user={user} isLoading={loading} />}>  
            <Route path="/admin-role-adjustment" element={<AdminRolBeheer />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/registreer" element={<Registreer />} />
          <Route path="/forgot-pw" element={<Forgot_Password />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Routes that are accesible for loggedin users only */}
          <Route element ={<LoggedinRoutes user={user} isLoading={loading} />}>
            <Route path="/" element={<Main_Page />} />
            <Route path="/main-page" element={<Main_Page />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:messageID" element={<SingleMessage />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:eventID" element={<SingleEvent />} />
            <Route path="/weekplanner" element={<WeekPlanner />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/event" element={<div><SelectedEvent /><Reviews eventId={""} /></div>} />
            <Route path="/send-message" element={<Send_Message />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
            <Route path="/admin-profile" element={<Profiel />} />
            <Route path="/MonthPlanner" element={<MonthPlanner />} />
            <Route path="/DayPlanner" element={<DayPlanner />} />
            <Route path="/Reviews" element={<Reviews eventId={""} />} />
            <Route path="/SelectedEvent" element={<SelectedEvent />} />
            <Route path="/DayPlanner/:date" element={<DayPlanner />} />
            <Route path="/MonthDayView" element={<MonthDayView />} />
            <Route path="/About" element={<About />} />
            <Route path="/events/:eventId" element={<SelectedEvent />} />
            <Route path="/selectedevent/:eventId" element={<SelectedEvent />} />
            <Route path="/selectedeventwithreviews/:eventId" element={<SelectedEvent2 />} />
          </Route>
        </Routes>
      </main>
    </div>

  );
};


const App: React.FC = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;