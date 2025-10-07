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
import NewWaterfallView from './apps/waterfall/views/NewWaterfallView';
import SelectWaterfallView from './apps/waterfall/views/SelectWaterfallView';
import SetupView from './apps/waterfall/views/SetupView';
import WaterfallEditLayout from './apps/waterfall/views/edit/WaterfallEditLayout';
import WaterfallHomeLayout from './apps/waterfall/views/WaterfallHomeLayout';

export default function App() {
  return (
    <AuthProvider>
      <WebflowProvider>
        <WellflowProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<WellflowMainView />} />
              <Route path="/waterfall" element={<WaterfallLayout />}>
                <Route element={<WaterfallHomeLayout />}>
                  <Route index element={<NewWaterfallView />} />
                  <Route path="create" element={<CreateView />} />
                  <Route path="setup" element={<SetupView />} />
                  <Route path="select" element={<SelectWaterfallView />} />
                </Route>
                <Route path="edit" element={<WaterfallEditLayout />}>
                  <Route index element={<EditView />} />
                  <Route path=":categoryName" element={<CategoryView />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </WellflowProvider>
      </WebflowProvider>
    </AuthProvider>
  );
}
