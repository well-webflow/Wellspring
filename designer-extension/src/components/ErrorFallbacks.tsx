import { useNavigate } from 'react-router';
import Button from './UI/Button';
import { faHome, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ErrorFallbackProps {
  error?: Error | null;
  resetError?: () => void;
}

export function WaterfallErrorFallback({ error }: ErrorFallbackProps) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <div className="space-y-4 max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-2xl" />
          </div>
        </div>
        <h2 className="text-lg font-bold text-text1">Waterfall Editor Error</h2>
        <p className="text-sm text-text2">
          Something went wrong with the Waterfall editor. Don't worry, your site and other features are safe.
        </p>
        {error && (
          <details className="text-left text-xs bg-bg2 p-3 rounded border border-border1">
            <summary className="cursor-pointer font-medium text-text2 mb-2">Technical details</summary>
            <pre className="overflow-auto text-red-600 whitespace-pre-wrap">{error.message}</pre>
          </details>
        )}
        <div className="flex gap-2 justify-center pt-2">
          <Button onClick={handleGoHome} icon={faHome} size="sm" color="primary">
            Return to Home
          </Button>
          <Button onClick={() => window.location.reload()} size="sm" color="secondary">
            Reload Extension
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CategoryErrorFallback({ error }: ErrorFallbackProps) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center">
      <div className="space-y-3 max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-600 text-xl" />
          </div>
        </div>
        <h3 className="text-base font-semibold text-text1">Failed to Load Settings</h3>
        <p className="text-sm text-text2">This category couldn't be loaded. Try going back or refreshing.</p>
        {error && (
          <details className="text-left text-xs bg-bg2 p-2 rounded border border-border1">
            <summary className="cursor-pointer font-medium text-text2 mb-1">Error details</summary>
            <pre className="overflow-auto text-red-600 text-xs whitespace-pre-wrap">{error.message}</pre>
          </details>
        )}
        <div className="flex gap-2 justify-center pt-2">
          <Button onClick={handleGoBack} size="sm" color="primary">
            Go Back
          </Button>
          <Button onClick={() => window.location.reload()} size="sm" color="secondary">
            Reload
          </Button>
        </div>
      </div>
    </div>
  );
}