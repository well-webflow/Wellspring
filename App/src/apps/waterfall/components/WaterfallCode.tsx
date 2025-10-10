import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';
import { Heading, Paragraph } from '../../../components/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism.css';
import { useState, useEffect } from 'react';
import Button from '../../../components/UI/Button';

interface WaterfallCodeProps {
  version?: string | 'latest'; // Specific version or 'latest' to fetch from npm
}

export function WaterfallCode({ version: propVersion = 'latest' }: WaterfallCodeProps) {
  const [copied, setCopied] = useState(false);
  const [version, setVersion] = useState('1.0');
  const [loading, setLoading] = useState(propVersion === 'latest');

  useEffect(() => {
    if (propVersion === 'latest') {
      const fetchLatestVersion = async () => {
        try {
          const response = await fetch('https://registry.npmjs.org/well-waterfall/latest');
          const data = await response.json();
          setVersion(data.version);
        } catch (error) {
          console.error('Failed to fetch latest version:', error);
          // Keep default version if fetch fails
        } finally {
          setLoading(false);
        }
      };

      fetchLatestVersion();
    } else {
      setVersion(propVersion);
      setLoading(false);
    }
  }, [propVersion]);

  const npmPackageCode = `<script src="https://cdn.jsdelivr.net/npm/well-waterfall@${version}"></script>`;
  const highlightedCode = Prism.highlight(npmPackageCode, Prism.languages.markup, 'markup');

  const copyToClipboard = async () => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(npmPackageCode);
      } else {
        // Fallback for environments where clipboard API is blocked
        const textArea = document.createElement('textarea');
        textArea.value = npmPackageCode;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Show user-friendly error message
      alert('Could not copy to clipboard. Please select and copy the text manually.');
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Heading level={4}>Install Latest Stable Version</Heading>
        {loading && <span className="text-sm text-text3">Loading latest version...</span>}
        {!loading && <span className="text-sm text-text3">v{version}</span>}
      </div>
      <div className="relative flex gap-1 items-stretch min-w-0 w-full">
        <pre className="bg-gray-100 p-3 flex-1 min-w-0 rounded font-mono text-sm overflow-x-auto whitespace-nowrap">
          <code className="language-markup" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        </pre>
        <div className="flex-shrink-0">
          <Button onClick={copyToClipboard}>
            <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>

      <Paragraph size="sm" className="text-text3 mt-2 mb-0">
        Add this script tag to before the &lt;/body&gt; on each page you want to use Waterfall, or in the global code
        settings.
      </Paragraph>
    </div>
  );
}
