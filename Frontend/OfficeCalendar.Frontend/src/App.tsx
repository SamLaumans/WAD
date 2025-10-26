import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SelectedEvent from './components/SelectedEvent';
import Reviews from './components/Reviews';
import WeekPlanner from './components/WeekPlanner';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Toolbar from './pages/toolbar/Toolbar';
import Login from './components/Login';
import Registreer from './pages/register/Registreer';
import Forgot_Password from './pages/forgot-password/Forgot-Password';
import Main_Page from './pages/main-page/Main-Page';
import Messages from './pages/messages/Messages';
import SingleMessage from './pages/singlemessage/SingleMessage';
import CreateEvent from './pages/create-event/Event';
import AdminPanel from './pages/admin-panel/AdminPanel';
//import EventModal from "./pages/create-event/EventModal";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <Toolbar />
      </div>
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
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registreer" element={<Registreer />} />
            <Route path="/forgot-pw" element={<Forgot_Password />} />
            <Route path="/main-page" element={<Main_Page />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:messageID" element={<SingleMessage />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
          </Routes>
        </div>

        {/* Standard footer on all pages */}
        <Footer />
      </div>
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
};

export default App;