import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { ToastProvider } from './components/Toast.tsx';
import { ContentProvider } from './context/ContentContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <ContentProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ContentProvider>
  </ErrorBoundary>,
);
