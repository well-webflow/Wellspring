import { Route, Routes } from 'react-router';
import Layout from './Layout';
import InitializationView from './views/waterfall/InitializationView';
import { AuthProvider } from './context/authProvider';
import CreateView from './views/waterfall/CreateView';
import EditView from './views/waterfall/EditView';
import CategoryView from './views/waterfall/CategoryView';
import WellflowMainView from './views/WellflowMainView';
import { WaterfallProvider } from './context/WaterfallContext';
import WaterfallSearchView from './views/waterfall/WaterfallSearchView';
import WaterfallLayout from './views/waterfall/WaterfallLayout';

export default function App() {
  return (
    <AuthProvider>
      <WaterfallProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<WellflowMainView />} />
            <Route path="/waterfall" element={<WaterfallLayout />}>
              <Route index element={<InitializationView />} />
              <Route path="create" element={<CreateView />} />
              <Route path="search" element={<WaterfallSearchView />} />
              <Route path="edit" element={<EditView />} />
              <Route path="edit/:categoryName" element={<CategoryView />} />
            </Route>
          </Route>
        </Routes>
      </WaterfallProvider>
    </AuthProvider>
  );
}
