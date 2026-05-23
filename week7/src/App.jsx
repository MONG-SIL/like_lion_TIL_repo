import './styles/style.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { lions as initialLions } from './data/lions.js';
import { useLions } from './hooks/useLions.js';
import { useRandomUserFetch } from './hooks/useRandomUserFetch.js';
import ListPage from './pages/ListPage.jsx';
import DetailPage from './pages/DetailPage.jsx';

export default function App() {
  const { lions, addLions, deleteLastLion, replaceAllExceptSelf, canDeleteLast } =
    useLions(initialLions);

  const fetchBag = useRandomUserFetch({
    addLions,
    replaceAllExceptSelf,
    getLions: () => lions,
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ListPage
              lions={lions}
              canDeleteLast={canDeleteLast}
              deleteLastLion={deleteLastLion}
              addLions={addLions}
              fetchBag={fetchBag}
            />
          }
        />
        <Route path="/lions/:id" element={<DetailPage lions={lions} />} />
      </Routes>
    </BrowserRouter>
  );
}
