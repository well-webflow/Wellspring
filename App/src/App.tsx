import { Route, Routes } from 'react-router';
import Layout from './Layout';
import HomeView from './apps/waterfall/views/HomeView';
import { AuthProvider } from './context/authProvider';
import WellflowMainView from './views/WellflowMainView';
import WaterfallLayout from './apps/waterfall/views/WaterfallLayout';
import EditView from './apps/waterfall/views/edit/EditView';
import CategoryView from './apps/waterfall/views/edit/CategoryView';
import { WebflowProvider } from './context/webflowContext';
import { WellflowProvider } from './context/wellflowContext';

export default function App() {
  return (
    <AuthProvider>
      <WebflowProvider>
        <WellflowProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<WellflowMainView />} />
              <Route path="/waterfall" element={<WaterfallLayout />}>
                <Route index element={<HomeView />} />
                <Route path="edit" element={<EditView />} />
                <Route path="edit/:categoryName" element={<CategoryView />} />
              </Route>
            </Route>
          </Routes>
        </WellflowProvider>
      </WebflowProvider>
    </AuthProvider>
  );
}
