import { Route, Routes } from 'react-router';
import { WaterfallProvider } from './context/waterfallContext';
import Layout from './Layout';
import InitializationView from './views/waterfall/InitializationView';
import { AuthProvider } from './context/authProvider';
import CreateView from './views/waterfall/CreateView';
import EditView from './views/waterfall/EditView';
import CategoryView from './views/waterfall/CategoryView';
import WellflowMainView from './views/WellflowMainView';

export default function App() {
  return (
    <AuthProvider>
      <WaterfallProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<WellflowMainView />} />
            <Route path="/waterfall">
              <Route index element={<InitializationView />} />
              <Route path="create" element={<CreateView />} />
              <Route path="edit" element={<EditView />} />
              <Route path="edit/:categoryName" element={<CategoryView />} />
            </Route>
          </Route>
        </Routes>
      </WaterfallProvider>
    </AuthProvider>
  );
}
