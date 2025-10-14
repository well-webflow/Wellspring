import { Route, Routes } from 'react-router';
import Layout from './Layout';
import { AuthProvider } from './context/authProvider';
import WellflowMainView from './views/WellflowMainView';
import WaterfallLayout from './apps/waterfall/views/WaterfallLayout';
import EditView from './apps/waterfall/views/edit/EditView';
import CategoryView from './apps/waterfall/views/edit/CategoryView';
import { WebflowProvider } from './context/webflowContext';
import { WellflowProvider } from './context/wellflowContext';
import CreateView from './apps/waterfall/views/CreateView';
import SelectWaterfallView from './apps/waterfall/views/SelectWaterfallView';
import SetupView from './apps/waterfall/views/SetupView';
import EditLayout from './apps/waterfall/views/edit/EditLayout';
import NewWaterfallLayout from './apps/waterfall/views/new/NewWaterfallLayout';
import NewWaterfallView from './apps/waterfall/views/new/NewWaterfallView';

export default function App() {
  return (
    // <AuthProvider>
    <WebflowProvider>
      <WellflowProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<WellflowMainView />} />
            <Route path="/waterfall" element={<WaterfallLayout />}>
              <Route element={<NewWaterfallLayout />}>
                <Route index element={<NewWaterfallView />} />
                <Route path="new/:categoryName" element={<CategoryView />} />
              </Route>
              <Route path="create" element={<CreateView />} />
              <Route path="new"></Route>
              <Route path="setup" element={<SetupView />} />
              <Route path="select" element={<SelectWaterfallView />} />
              <Route path="edit" element={<EditLayout />}>
                <Route path=":waterfallName" element={<EditView />} />
                <Route path=":waterfallName/:categoryName" element={<CategoryView />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </WellflowProvider>
    </WebflowProvider>
    // </AuthProvider>
  );
}
