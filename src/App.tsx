import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import InvestmentClassesPage from './pages/InvestmentClassesPage';
import PortfolioPage from './pages/PortfolioPage';
import TeamPage from './pages/TeamPage';
import ApplyPage from './pages/ApplyPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <Router>
      {/* <Router basename="/v1/"></Router> */}
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/investment-classes" element={<InvestmentClassesPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/apply" element={<ApplyPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;