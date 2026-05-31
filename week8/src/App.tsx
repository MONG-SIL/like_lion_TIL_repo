import './styles/style.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { lions as initialLions } from './data/lions';
import { useLions } from './hooks/useLions';
import { useRandomUserFetch } from './hooks/useRandomUserFetch';
import ListPage from './pages/ListPage';
import DetailPage from './pages/DetailPage';

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
