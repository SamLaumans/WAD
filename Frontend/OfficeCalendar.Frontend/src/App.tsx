import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SelectedEvent from './components/SelectedEvent';
import Reviews from './components/Reviews';
import WeekPlanner from './components/WeekPlanner';
import MonthPlanner from "./components/MonthPlanner";
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Toolbar from './pages/toolbar/Toolbar';
import Registreer from './pages/register/Registreer';
import Login from './pages/login/Login';
import Forgot_Password from './pages/forgot-password/Forgot-Password';
import Main_Page from './pages/main-page/Main-Page';
import Messages from './pages/messages/Messages';
import SingleMessage from './pages/singlemessage/SingleMessage';
import CreateEvent from './pages/create-event/Event';
import AdminPanel from './pages/admin-panel/AdminPanel';
import Profiel from "./pages/profile-page/profiel";
import AdminToevoegen from "./pages/admin-promote/admin-promote";
import AdminVerwijderen from "./pages/admin-demote/admin-demote";
//import EventModal from "./pages/create-event/EventModal";
import Events from './pages/events/Events';
import SingleEvent from './pages/singleevent/SingleEvent';
import Send_Message from './pages/send-message/send-message';
import DayPlanner from "./components/DayPlanner";

const AppContent: React.FC = () => {
  const location = useLocation();

  const showHeaderFooter =
    location.pathname !== '/' &&
    location.pathname !== '/login' &&
    location.pathname !== '/registreer' &&
    location.pathname !== '/forgot-pw';

  return (
    <div className="app-container">
      {showHeaderFooter && <Toolbar />}

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
          <Route path="/send-message" element={<Send_Message />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/admin-promote" element={<AdminToevoegen />} />
          <Route path="/admin-demote" element={<AdminVerwijderen />} />
          <Route path="/admin-profile" element={<Profiel />} />
          <Route path="/MonthPlanner" element={<MonthPlanner />} />
          <Route path="/DayPlanner" element={<DayPlanner />} />
          <Route path="/Reviews" element={<Reviews />} />
          <Route path="/SelectedEvent" element={<SelectedEvent />} />

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
// popup event code
// const [showModal, setShowModal] = useState(false);

// return (
//   <div>
//     <h1>Welkom op de hoofdpagina</h1>
//     <button onClick={() => setShowModal(true)}>Nieuw Event Aanmaken</button>

//     <EventModal show={showModal} onClose={() => setShowModal(false)} />
//   </div>
// );

export default App;