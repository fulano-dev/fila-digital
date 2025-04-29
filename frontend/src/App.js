import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutProvider, useLayout } from './context/LayoutContext'; // Importando o LayoutContext
import Home from './pages/Home';
import RestaurantDetails from './pages/RestaurantDetails';
import WaitlistForm from './pages/WaitlistForm';
import QueueStatus from './pages/QueueStatus';


function App() {
  return (

      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:restaurantId" element={<RestaurantDetails />} />
          <Route path="/waitlist-form/:branchId" element={<WaitlistForm />} />
          <Route path="/queue-status/:idFila" element={<QueueStatus />} />


        </Routes>
      </Router>

  );
}

// Envolvendo a aplicação com o LayoutProvider
export default function WrappedApp() {
  return (
    <LayoutProvider>
      <App />
    </LayoutProvider>
  );
}