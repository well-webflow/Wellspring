import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';
import { Heading, Paragraph } from '../../../components/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Import minimal Prism setup (core + markup only, no file-highlight plugin)
import { Prism } from '../../../lib/prism-minimal';
import 'prismjs/themes/prism.css';
import { useState } from 'react';
import Button from '../../../components/UI/Button';

// Pinned version and SRI hash for security
const WATERFALL_VERSION = '1.2.10';
const WATERFALL_SRI = 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wc';

interface WaterfallCodeProps {
  version?: string; // Optional specific version override (must be validated)
}

export function WaterfallCode({ version: propVersion }: WaterfallCodeProps) {
  const [copied, setCopied] = useState(false);

  // Use pinned version, only allow override if it matches semver pattern
  let version = WATERFALL_VERSION;
  if (propVersion && /^\d+\.\d+\.\d+$/.test(propVersion)) {
    version = propVersion;
  }

  const npmPackageCode = `<script type="module" src="https://cdn.jsdelivr.net/npm/well-waterfall@${version}" integrity="${WATERFALL_SRI}" crossorigin="anonymous"></script>`;
  const highlightedCode = Prism.highlight(npmPackageCode, Prism.languages.markup, 'markup');

  const copyToClipboard = async () => {
    try {
      // Use Clipboard API (modern browsers)
      await navigator.clipboard.writeText(npmPackageCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      webflow.notify({
        type: 'Error',
        message: 'Could not copy to clipboard. Please select and copy the text manually.',
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Heading level={4}>Install Latest Stable Version</Heading>
        <span className="text-sm text-text3">v{version}</span>
      </div>
      <div className="relative flex gap-1 items-stretch min-w-0 w-full">
        <pre className="bg-gray-100 p-3 flex-1 min-w-0 rounded font-mono text-sm overflow-x-auto whitespace-nowrap">
          <code className="language-markup" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        </pre>
        <div className="shrink-0">
          <Button onClick={copyToClipboard}>
            <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>

      <Paragraph size="sm" className="text-text3 mt-2 mb-0">
        Add this script at the end of the &lt;head&gt; tag on each page you want to use Waterfall, or in the site-wide
        Custom Code settings of your website.
      </Paragraph>
    </div>
  );
}
