/**
 * The Waterfall release history the app reasons about.
 *
 * This list is hand-maintained on purpose. The library ships no CHANGELOG, and the
 * generated `scripts/reference-data.json` carries no `since` metadata, so none of
 * this can be derived from the package — it has to be written down when a release
 * is pinned.
 *
 * It lives in the Worker rather than in the Designer Extension so that a new release
 * reaches every site on a `wrangler deploy`, with no extension rebuild and no App
 * review cycle in between.
 *
 * ## When pinning a new Waterfall version in WELL_WATERFALL, add an entry here.
 *
 * Set `breaking: true` when upgrading *past* that version can change how an already
 * built slider behaves — not just when the API changed. Two things qualify:
 *
 *   1. An attribute was renamed or removed. Waterfall silently ignores attributes it
 *      does not recognise, so the setting quietly reverts to its default rather than
 *      erroring. See docs/migration-1.5.md in the Waterfall repo.
 *   2. A runtime default flipped, so a slider carrying no new attribute at all still
 *      renders or behaves differently.
 *
 * If in doubt, mark it breaking. A needless warning costs a click; a missed one
 * silently changes a published site.
 */
export interface Release {
	version: string;
	/** ISO date (YYYY-MM-DD), from the npm publish time. */
	date: string;
	/** Upgrading past this version can change an existing slider. See the note above. */
	breaking?: boolean;
	/** One line, shown as the entry's headline. */
	summary: string;
	/** Specifics, shown as bullets under the summary. */
	changes?: string[];
	/** Link to a migration guide, shown on breaking entries. */
	migrationUrl?: string;
}

/** Newest first. */
export const RELEASES: Release[] = [
	{
		version: '1.6.0',
		date: '2026-11-21',
		breaking: true,
		summary: 'Bullet and scrollbar handle classes come only from your own elements now.',
		changes: [
			'waterfall-pagination-bullet-class, waterfall-pagination-bullet-active-class and waterfall-scrollbar-drag-class were removed. The Pagination Bullet, Pagination Bullet Active and Scrollbar Drag elements are the only source of those classes now, so there is one place to set them instead of two. A leftover attribute is ignored rather than reported.',
			'waterfall-el="pagination-bullet-active" is read again after being dropped in 1.5.0. Give it the bullet element\'s classes plus one more, and that extra class is the one applied to the active bullet.',
		],
	},
	{
		version: '1.5.4',
		date: '2026-11-11',
		summary: 'Parallax is explicit again.',
		changes: [
			'Parallax no longer turns itself on when it finds data-swiper-parallax elements. Set waterfall-parallax-enabled="true" to enable it.',
		],
	},
	{
		version: '1.5.3',
		date: '2026-11-11',
		summary: 'Autoplay controls work without being switched on, and hover-pause works at zero delay.',
		changes: [
			'The autoplay control button is now on by default whenever its waterfall-el elements are present. Set waterfall-autoplay-control-enabled="false" to turn it off.',
			'Hover-pause now works for smooth autoplay (delay 0), which Swiper\'s own pauseOnMouseEnter cannot handle.',
		],
	},
	{
		version: '1.5.2',
		date: '2026-11-06',
		summary: 'Documentation domain moved to heywellspring.com.',
	},
	{
		version: '1.5.1',
		date: '2026-11-03',
		summary: 'Pagination bullets and scrollbar handles use your own classes again.',
		changes: [
			'Classes on your pagination bullet and scrollbar drag elements are carried onto the generated elements, as they were before 1.5.0.',
			'Setting waterfall-scrollbar-drag-class now removes the donor element from the page.',
		],
	},
	{
		version: '1.5.0',
		date: '2026-11-02',
		breaking: true,
		summary: 'Attribute names were reorganised. Sliders built before 1.5.0 need their attributes updated.',
		changes: [
			'39 attributes were renamed and 9 were removed, with no backwards compatibility. An old name is ignored rather than reported, so the setting silently falls back to its default.',
			'Effect options gained an -effect- segment (waterfall-coverflow-depth is now waterfall-coverflow-effect-depth).',
			'Mousewheel options moved from waterfall-mouse-* to waterfall-mousewheel-*.',
			'Autoplay options gained the group prefix (waterfall-delay is now waterfall-autoplay-delay).',
			'waterfall-autoplay-mode, waterfall-loop-mode and waterfall-data-one-way-movement were shortened to waterfall-autoplay, waterfall-loop and waterfall-one-way-movement.',
			'Fade sliders no longer cross-fade by default. Add waterfall-fade-effect-mode="cross-fade" to keep the old look.',
		],
	},
	{
		version: '1.3.1',
		date: '2026-10-23',
		breaking: true,
		summary: 'Breakpoint suffixes were renamed to match Webflow.',
		changes: [
			'-lmobile became -mobile-large, -large became -desktop-small, and -xlarge became -desktop-large. -tablet and -desktop are unchanged.',
			'Breakpoint pixel ranges changed to match Webflow, and values now cascade outward from Desktop.',
		],
	},
];

export type UpdateKind = 'none' | 'routine' | 'breaking';

export interface UpdateInfo {
	kind: UpdateKind;
	/** The version on the site, or null when it could not be read. */
	from: string | null;
	/** The version this app pins. */
	to: string;
	/** Releases newer than `from`, up to and including `to`. Newest first. */
	releases: Release[];
}

/**
 * Compares two `x.y.z` strings. Returns a negative number when `a` is older than
 * `b`, 0 when they match, positive when `a` is newer. Returns null when either
 * side isn't a version we can read, so callers can decline to guess.
 */
export function compareVersions(a: string, b: string): number | null {
	const parse = (v: string) => {
		const parts = v.trim().split('.');
		if (parts.length === 0 || parts.length > 3) return null;
		const nums = parts.map((p) => (/^\d+$/.test(p) ? Number(p) : null));
		return nums.some((n) => n === null) ? null : (nums as number[]);
	};

	const left = parse(a);
	const right = parse(b);
	if (!left || !right) return null;

	for (let i = 0; i < 3; i++) {
		const diff = (left[i] ?? 0) - (right[i] ?? 0);
		if (diff !== 0) return diff;
	}
	return 0;
}

/**
 * Works out what moving a site from `installed` to `target` would mean.
 *
 * A hop counts as breaking when any release marked breaking falls in the half-open
 * range (installed, target] — that is, when the upgrade crosses it. Being *on* a
 * breaking version is fine; it's passing one that changes a site.
 *
 * An unreadable or newer-than-target installed version yields 'none', so a site is
 * never nagged on the strength of a version string we don't understand.
 */
export function describeUpdate(installed: string | null, target: string): UpdateInfo {
	const none: UpdateInfo = { kind: 'none', from: installed, to: target, releases: [] };

	if (!installed) return none;

	const behind = compareVersions(installed, target);
	if (behind === null || behind >= 0) return none;

	// Everything newer than what's installed, up to and including the target.
	const crossed = RELEASES.filter((release) => {
		const afterInstalled = compareVersions(release.version, installed);
		const atOrBeforeTarget = compareVersions(release.version, target);
		return afterInstalled !== null && afterInstalled > 0 && atOrBeforeTarget !== null && atOrBeforeTarget <= 0;
	});

	return {
		kind: crossed.some((release) => release.breaking) ? 'breaking' : 'routine',
		from: installed,
		to: target,
		releases: crossed,
	};
}
