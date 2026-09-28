/*
 * The glyph that goes beside a credential, chosen by the credential's `kind`.
 *
 * It lives here rather than in either card because two components draw
 * credentials now — the compact roster card and the department coordinator card
 * — and a second hand-written copy of the map is exactly how the two would end
 * up pointing a mortarboard at a licence. The same class of mistake as three
 * spellings of one portrait frame, and equally invisible in review.
 *
 * The keys are derived from `CREDENTIAL_KINDS` in the collection schema rather
 * than written out, through a type-only import so nothing is pulled into
 * either component's module graph at runtime. That makes the map exhaustive by
 * construction: adding a kind to the schema without giving it a glyph is a
 * compile error at this file, not a `undefined` icon discovered on the page.
 */
import type { CREDENTIAL_KINDS } from '../content.config';
import type { IconName } from './Icon.astro';

type CredentialKind = (typeof CREDENTIAL_KINDS)[number];

const KIND_ICON = {
	degree: 'school',
	licence: 'verified',
	certification: 'workspace_premium',
	membership: 'badge',
	leadership: 'military_tech',
	industry: 'briefcase',
} as const satisfies Record<CredentialKind, IconName>;

export const credentialIcon = (kind: CredentialKind): IconName => KIND_ICON[kind];
