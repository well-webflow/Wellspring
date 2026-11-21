import { useEffect, useState } from 'react';
import { faSpinner, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchReleases, type Release } from '../../../lib/api';
import { Heading, Paragraph } from '../../../components/Typography';

/**
 * The Waterfall release history, newest first.
 *
 * The list comes from the Worker rather than the bundle, so a new release — and in
 * particular a breaking one — reaches users on a deploy, without shipping a new
 * version of this extension through App review.
 */
export default function Changelog({ installedVersion }: { installedVersion: string | null }) {
  const [releases, setReleases] = useState<Release[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchReleases()
      .then((result) => {
        if (!cancelled) setReleases(result.releases);
      })
      .catch((err) => {
        console.error('Could not load the changelog:', err);
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // The changelog is reference material, so a failure to load it is reported quietly
  // and never blocks the rest of Setup.
  if (failed) {
    return (
      <Paragraph size="sm" className="text-text2">
        The changelog couldn&apos;t be loaded right now.
      </Paragraph>
    );
  }

  if (releases === null) {
    return (
      <div className="flex items-center gap-2 text-sm text-text2">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
        Loading changelog...
      </div>
    );
  }

  if (releases.length === 0) {
    return (
      <Paragraph size="sm" className="text-text2">
        No releases have been published yet.
      </Paragraph>
    );
  }

  return (
    <ol className="flex flex-col gap-3">
      {releases.map((release) => (
        <li key={release.version} className="bg-background2 rounded-lg p-3">
          <div className="flex flex-row flex-wrap items-center gap-2 mb-1">
            <Heading level={5}>{release.version}</Heading>
            <span className="text-xs text-text3">{release.date}</span>

            {release.breaking && (
              <span className="flex items-center gap-1 text-xs text-red-400 bg-background5 px-2 py-0.5 rounded">
                <FontAwesomeIcon icon={faTriangleExclamation} />
                Breaking
              </span>
            )}

            {release.version === installedVersion && (
              <span className="text-xs text-green-600 bg-background5 px-2 py-0.5 rounded">On this site</span>
            )}
          </div>

          <Paragraph size="sm" className="text-text2 mb-0">
            {release.summary}
          </Paragraph>

          {release.changes && release.changes.length > 0 && (
            <ul className="list-disc pl-4 mt-2 flex flex-col gap-1">
              {release.changes.map((change) => (
                <li key={change} className="text-sm text-text2">
                  {change}
                </li>
              ))}
            </ul>
          )}

          {release.migrationUrl && (
            <a
              href={release.migrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-sm text-primary underline focus-visible:outline-2 focus-visible:outline-primary"
            >
              Read the migration guide
            </a>
          )}
        </li>
      ))}
    </ol>
  );
}
