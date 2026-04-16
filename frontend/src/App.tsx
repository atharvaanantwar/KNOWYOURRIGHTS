import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Scenario from './pages/Scenario';
import Progress from './pages/Progress';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scenario" element={<Scenario />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
