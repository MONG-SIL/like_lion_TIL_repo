import './styles/style.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useLions } from './hooks/useLions';
import { useRandomUserFetch } from './hooks/useRandomUserFetch';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  const auth = useAuth();
  const lionsBag = useLions(auth.isAuthenticated);

  const fetchBag = useRandomUserFetch({
    addLions: lionsBag.addLions,
    replaceAllExceptSelf: lionsBag.replaceAllExceptSelf,
    getLions: () => lionsBag.lions,
  });

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePage auth={auth} lionsBag={lionsBag} fetchBag={fetchBag} />}
        />
        <Route
          path="/lions/:id"
          element={<DetailPage lions={lionsBag.lions} auth={auth} loading={lionsBag.loading} />}
        />
        <Route path="/login" element={<LoginPage auth={auth} />} />
      </Routes>
    </HashRouter>
  );
}
