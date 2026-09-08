import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AnimatedBackground from './components/AnimatedBackground';
import Dashboard from './pages/Dashboard/Dashboard';
import Auth from './pages/Auth/Auth';
import Profile from './pages/Profile/Profile';
import ResumeUpload from './pages/ResumeUpload/ResumeUpload';
import Interviews from './pages/Interviews/Interviews';
import Leaderboard from './pages/Leaderboard/Leaderboard';
import VoiceInterview from './pages/VoiceInterview/VoiceInterview';
import CodingEditor from './pages/CodingEditor/CodingEditor';
import Analytics from './pages/Analytics/Analytics';
import CompanyPrep from './pages/CompanyPrep/CompanyPrep';
import InterviewFeedback from './pages/InterviewFeedback/InterviewFeedback';
import Courses from './pages/Courses/Courses';

function App() {
  return (
    <>
      <AnimatedBackground />
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="resume" element={<ResumeUpload />} />
          <Route path="interviews" element={<Interviews />} />
          <Route path="courses" element={<Courses />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="voice-interview" element={<VoiceInterview />} />
          <Route path="coding" element={<CodingEditor />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="company" element={<CompanyPrep />} />
          <Route path="feedback" element={<InterviewFeedback />} />
        </Route>
      </Routes>
    </Router>
    </>
  );
}

export default App;
