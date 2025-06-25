import { Route, Routes } from 'react-router';
import { WaterfallProvider } from './context/waterfallContext';
import Layout from './Layout';
import InitializationView from './views/InitializationView';
import EditView from './views/EditView';
import CategoryView from './views/CategoryView';
import CreateView from './views/CreateView';
import { AuthProvider } from './context/authProvider';

export default function App() {
  return (
    <AuthProvider>
      <WaterfallProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<InitializationView />} />
            <Route path="/create" element={<CreateView />} />
            <Route path="/edit" element={<EditView />} />
            <Route path="/edit/:categoryName" element={<CategoryView />} />
          </Route>
        </Routes>
        <Layout />
      </WaterfallProvider>
    </AuthProvider>
  );
}
