import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Profile from "./pages/profile"; // note: matching filename casing 'profile.jsx' is lowercase
import Requests from "./pages/Requests";
import Connections from "./pages/Connections";
import Sessions from "./pages/Sessions";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes wrapped in Layout */}
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} /> 
      <Route path="/chat/:userId" element={<Layout><Chat /></Layout>} />
      <Route path="/profile" element={<Layout><Profile /></Layout>} /> 
      <Route path="/requests" element={<Layout><Requests /></Layout>} />
      <Route path="/connections" element={<Layout><Connections /></Layout>} />
      <Route path="/sessions" element={<Layout><Sessions /></Layout>} />
    </Routes>
  );
}

export default App;