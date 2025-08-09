import { Route, Routes } from 'react-router';
import Layout from './Layout';
import HomeView from './apps/waterfall/views/HomeView';
import { AuthProvider } from './context/authProvider';
import CreateView from './apps/waterfall/views/CreateWaterfallView';
import WellflowMainView from './views/WellflowMainView';
import WaterfallSearchView from './apps/waterfall/views/edit/SelectWaterfallView';
import WaterfallLayout from './apps/waterfall/views/WaterfallLayout';
import ManipulationView from './apps/waterfall/views/ManipulationView';
import EditView from './apps/waterfall/views/edit/EditView';
import CategoryView from './apps/waterfall/views/edit/CategoryView';
import { WebflowProvider } from './context/webflowContext';

export default function App() {
  return (
    <AuthProvider>
      <WebflowProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<WellflowMainView />} />
            <Route path="/waterfall" element={<WaterfallLayout />}>
              <Route index element={<HomeView />} />
              <Route path="create" element={<CreateView />} />
              <Route path="search" element={<WaterfallSearchView />} />
              <Route path="edit" element={<EditView />} />
              <Route path="edit/:categoryName" element={<CategoryView />} />
              <Route path="manipulation" element={<ManipulationView />} />
            </Route>
          </Route>
        </Routes>
      </WebflowProvider>
    </AuthProvider>
  );
}
