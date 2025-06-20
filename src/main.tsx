import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from "react-router";
import { DatabaseProvider } from './contexts/DatabaseContext.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Login from './pages/Login.tsx';

createRoot(document.getElementById('root')!).render(
  <DatabaseProvider>
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />

        
      </Routes>
    </BrowserRouter>
  </DatabaseProvider>
)
