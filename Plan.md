# Plan: Dark Mode

Concept for adding a dark mode to the site. This document is a plan only; no code has been changed
yet.

## Goals

1. **System-dependent by default**: the theme follows `prefers-color-scheme` of the operating system.
2. **Manual toggle**: a switch in the top right corner lets the visitor override the system theme.
3. **macOS/iOS look**: the toggle looks like an iOS/macOS switch (pill-shaped track, round knob) and
   animates between states.
4. **Works without JavaScript**: system detection and the toggle work with CSS only. JavaScript is
   only a progressive enhancement (persisting the choice across page loads).
5. **Minimal implementation**: no new dependencies, as few touched files as possible, no rework of
   the existing components beyond swapping color classes.

## Non-goals

- No theme picker with more than two options (no "auto / light / dark" segmented control).
- No redesign of the colored feature cards on the home page (hero gradient, podcast card, portfolio
  card, avatar). They have their own fixed colors and work on a dark background as they are.
- No changes to the code block theme (`prism.css` is already a dark Tokyo Night theme).

## Current state

- SvelteKit 1 with `adapter-static`, every page is prerendered (`prerender = true`).
- Tailwind CSS 3.2.4 with `@tailwindcss/typography`. No `darkMode` setting in
  `tailwind.config.cjs`.
- Colors are hard-coded Tailwind classes:
  - `src/app.html`: `<html class="font-mono bg-slate-100">` (page background).
  - `src/routes/(pages)/+layout.svelte`: window card `bg-white`, links
    `hover:bg-black hover:text-white`, header with macOS "traffic light" dots on the left and the
    site title link on the right.
  - `src/routes/(pages)/imprint/+page.svelte`: link `hover:bg-black hover:text-white`.
  - `src/routes/(pages)/+page.svelte`: divider `border-gray-300`.
  - `src/routes/(pages)/blog/[slug]/+page.svelte`: date `text-slate-500`.
  - `src/lib/BlogList.svelte`: already has a `darkMode` prop that switches between hard-coded light
    and dark class sets.
  - `tailwind.config.cjs`: typography overrides (inline code `slate-200`, links `emerald-600`).

## Approach

### Core idea: CSS custom properties + `:has()`

All theme-dependent colors become semantic CSS custom properties (design tokens). Tailwind gets
color names that point to these properties. Switching the theme only means switching the values of
the properties; no `dark:` variants are needed in the markup.

Why not Tailwind's `darkMode: 'class'` or `'media'`?

- `'media'` cannot be overridden by a toggle.
- `'class'` needs JavaScript to set the class, which violates the no-JS requirement.
- The required selector logic (system preference _combined with_ the toggle state) cannot be
  expressed as a single ancestor class, which is what Tailwind 3.2's `darkMode` strategies need.

With custom properties the whole logic lives in one small block of plain CSS.

### Theme resolution

The toggle is a native checkbox `#theme-toggle`. Its meaning in the CSS-only mode is **"use the
opposite of the system theme"**. This is the only way to support both directions without JS, since
the server-rendered (prerendered) HTML cannot know the visitor's system theme.

| System theme | Checkbox  | Effective theme |
| ------------ | --------- | --------------- |
| light        | unchecked | light           |
| light        | checked   | dark            |
| dark         | unchecked | dark            |
| dark         | checked   | light           |

If JavaScript is available, an explicit `data-theme="light|dark"` attribute on `<html>` takes
precedence over the table above (see "Progressive enhancement").

### Tokens

Defined in `src/app.postcss` as space-separated RGB channels, so Tailwind's opacity modifiers keep
working (`rgb(var(--color-x) / <alpha-value>)`, supported since Tailwind 3.1).

| Token            | Used for                            | Light         | Dark          |
| ---------------- | ----------------------------------- | ------------- | ------------- |
| `--color-canvas` | page background (`<html>`)          | `slate-100`   | `slate-950`   |
| `--color-window` | window card in the layout           | `white`       | `slate-900`   |
| `--color-text`   | body text, headings                 | `slate-800`   | `slate-100`   |
| `--color-muted`  | dates, descriptions                 | `slate-500`   | `slate-400`   |
| `--color-line`   | `hr`, borders                       | `gray-300`    | `slate-700`   |
| `--color-hover`  | hover background of blog list items | `slate-200`   | `slate-700`   |
| `--color-code`   | inline code background              | `slate-200`   | `slate-700`   |
| `--color-link`   | links in prose                      | `emerald-600` | `emerald-400` |

`slate-950` (`#020617`) is written as a raw value because Tailwind 3.2 does not ship it.

Each theme block also sets `color-scheme: light` / `color-scheme: dark`, so scrollbars, form
controls and the default text color follow the theme. `<meta name="color-scheme" content="light
dark">` goes into `src/app.html` so the browser picks the right canvas color before CSS loads.

### CSS sketch (`src/app.postcss`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
	/* Light theme (default) */
	:root {
		color-scheme: light;
		--color-canvas: 241 245 249;
		--color-window: 255 255 255;
		--color-text: 30 41 59;
		/* ...remaining light tokens... */
		--toggle-knob-x: 0;
		--toggle-track: 229 229 234;
	}

	/* Dark theme: system dark + toggle unchecked, or system light + toggle checked */
	@media (prefers-color-scheme: dark) {
		:root:not([data-theme]):not(:has(#theme-toggle:checked)) {
			/* dark tokens */
		}
	}
	@media (prefers-color-scheme: light) {
		:root:not([data-theme]):has(#theme-toggle:checked) {
			/* dark tokens */
		}
	}

	/* Explicit choice set by JavaScript */
	:root[data-theme='dark'] {
		/* dark tokens */
	}
}
```

The dark token list appears three times. That is accepted to keep the implementation free of
build-time tooling; it is about ten lines per block. The light tokens are the `:root` default, so
"system dark + toggle checked" and `data-theme='light'` need no extra rule: they simply do not
match any dark block.

### Tailwind config (`tailwind.config.cjs`)

```js
theme: {
	extend: {
		colors: {
			canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
			window: 'rgb(var(--color-window) / <alpha-value>)',
			fg: 'rgb(var(--color-text) / <alpha-value>)',
			muted: 'rgb(var(--color-muted) / <alpha-value>)',
			line: 'rgb(var(--color-line) / <alpha-value>)'
			// ...
		}
	}
}
```

The typography plugin is themed by pointing its own variables at the tokens inside the existing
`typography.DEFAULT.css` block, e.g. `'--tw-prose-body': 'rgb(var(--color-text))'`,
`'--tw-prose-headings'`, `'--tw-prose-bold'`, `'--tw-prose-quotes'`, `'--tw-prose-hr'`, etc. The
existing inline code background and link color move to `--color-code` and `--color-link`. This
avoids `prose-invert`, which would again need a `dark:` variant.

### Markup changes (class swaps only)

| File                                          | Before                                        | After                                        |
| --------------------------------------------- | --------------------------------------------- | -------------------------------------------- |
| `src/app.html`                                | `bg-slate-100`                                | `bg-canvas text-fg`                          |
| `src/routes/(pages)/+layout.svelte`           | `bg-white`, `hover:bg-black hover:text-white` | `bg-window`, `hover:bg-fg hover:text-window` |
| `src/routes/(pages)/imprint/+page.svelte`     | `hover:bg-black hover:text-white`             | `hover:bg-fg hover:text-window`              |
| `src/routes/(pages)/+page.svelte`             | `border-gray-300`                             | `border-line`                                |
| `src/routes/(pages)/blog/[slug]/+page.svelte` | `text-slate-500`                              | `text-muted`                                 |
| `src/lib/BlogList.svelte`                     | light branch of the `darkMode` prop           | token classes                                |

`BlogList`'s `darkMode` prop is only ever passed as `false`. Its light branch is replaced by the
token classes (`text-fg`, `text-muted`, `hover:bg-hover`). The prop and its dark branch can be
removed in the same step, since tokens now cover both themes.

## The toggle

### Placement

In the header row of `src/routes/(pages)/+layout.svelte`, to the right of the site title link
(`The empathic dev`), i.e. the top right corner of the window card. It is part of the layout, so it
appears on every page that uses the `(pages)` layout. The RSS route (`(no-layout)`) is unaffected.

### Markup

A single native element, no wrapper and no extra icons:

```svelte
<input
	id="theme-toggle"
	class="theme-toggle"
	type="checkbox"
	role="switch"
	aria-label="Switch between light and dark theme"
/>
```

- Native checkbox: focusable, operable with Space, works without JS.
- `appearance: none` removes the native look; the track is the element itself, the knob is its
  `::before` pseudo-element (pseudo-elements on `appearance: none` checkboxes are supported in all
  current browsers).

### macOS/iOS design

- Track: `51px × 31px`, `border-radius: 9999px`.
- Knob: `27px` circle, white, `2px` inset, soft shadow
  (`0 3px 8px rgb(0 0 0 / 0.15), 0 1px 1px rgb(0 0 0 / 0.16)`), like the iOS `UISwitch`.
- Off track color: `#E9E9EA` (iOS system gray 5). On track color: `#34C759` (iOS system green).
- Optional detail: a small sun/moon glyph via `::after` content is **not** planned to keep it
  minimal.

### Visual state follows the effective theme, not the checkbox

Because the checkbox means "invert" in CSS-only mode, a visitor with a dark system would see a dark
page with the switch in the "off" position. To avoid that, knob position and track color are also
tokens:

- light theme: `--toggle-knob-x: 0`, track gray
- dark theme: `--toggle-knob-x: 20px`, track green

The switch is therefore always "on" when the page is dark, regardless of how that state was
reached.

### Animation

```css
.theme-toggle {
	transition: background-color 200ms ease;
}
.theme-toggle::before {
	transform: translateX(var(--toggle-knob-x));
	transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
@media (prefers-reduced-motion: reduce) {
	.theme-toggle,
	.theme-toggle::before {
		transition: none;
	}
}
```

Optionally, `background-color` and `color` of `html` and the window card get the same 200 ms
transition so the page fades between themes. This must not apply on initial page load (only after
user interaction); if that turns out to be fiddly, the page transition is dropped.

Focus: visible `:focus-visible` ring (`outline: 2px solid` + `outline-offset: 2px`), matching the
macOS focus ring.

## Progressive enhancement with JavaScript

Without JS the choice is not persisted: every full page load starts with the system theme. With JS
the choice is remembered.

1. **Blocking inline script in `<head>` of `src/app.html`** (a few lines, runs before first paint,
   so there is no flash of the wrong theme):
   - read `localStorage.getItem('theme')` (`'light' | 'dark' | null`, wrapped in `try/catch`)
   - if set, write it to `document.documentElement.dataset.theme`
2. **Change handler for the checkbox** (in `+layout.svelte`, `onMount`):
   - on `change`, compute the new effective theme, store it in `localStorage`, set `data-theme`
   - keep `checkbox.checked` in sync with the effective theme so assistive technology announces
     the correct state ("on" = dark)
3. Once `data-theme` is set, the `:has()` rules are disabled by the `:not([data-theme])` guard, so
   the checkbox no longer has an "invert" meaning and simply reflects dark = checked.

Resetting to "follow system" is out of scope; clearing site data does it.

## Browser support and fallback levels

| Capability        | Requirement                                     | Fallback                                                    |
| ----------------- | ----------------------------------------------- | ----------------------------------------------------------- |
| System theme      | `prefers-color-scheme` (all current browsers)   | light theme                                                 |
| Toggle without JS | `:has()` (Safari 15.4, Chrome 105, Firefox 121) | toggle visible but without effect; system theme still works |
| Toggle with JS    | `localStorage`, `data-theme`                    | CSS-only behavior                                           |

Optional: hide the toggle where it cannot work with `@supports not selector(:has(*))`. This keeps
the UI honest on old browsers; with JS present it could still work, so the rule should be
`@supports not selector(:has(*)) { :root:not([data-theme]) .theme-toggle { display: none; } }`
only if testing shows it is worth the extra lines.

## Known limitations

- **No-JS navigation resets the toggle**: without JS each link is a full page load and the checkbox
  state is lost. This is inherent to a CSS-only solution without server state.
- **Screen readers in no-JS mode** announce the raw checkbox state ("off" on a dark system), which
  can differ from the visual state. The neutral `aria-label` ("Switch between light and dark
  theme") keeps the control understandable.
- **Brand cards keep their colors** (see Non-goals).

## Implementation steps

1. `src/app.postcss`: add tokens (light default, two dark media blocks, `data-theme` blocks) and the
   `.theme-toggle` styles.
2. `tailwind.config.cjs`: add token colors, point typography variables at the tokens.
3. `src/app.html`: `<meta name="color-scheme">`, token classes on `<html>`, inline theme script.
4. `src/routes/(pages)/+layout.svelte`: add the toggle to the header, swap color classes, add the
   `onMount` change handler.
5. Swap color classes in `imprint/+page.svelte`, `+page.svelte`, `blog/[slug]/+page.svelte`,
   `BlogList.svelte` (and drop the unused `darkMode` prop).
6. Run `npm run check`, `npm run lint`, `npm run build`.

Estimated size: about 80 lines of CSS, 10 lines of config, 15 lines of JS, plus class swaps.

## Test checklist

- [ ] Light system, no JS: page is light; toggling makes it dark; knob slides right, track turns
      green.
- [ ] Dark system, no JS: page is dark, switch shows "on"; toggling makes it light.
- [ ] Changing the OS theme while the page is open updates the page (no reload needed).
- [ ] With JS: choice survives reload and navigation; no flash of the wrong theme on load.
- [ ] Keyboard: toggle reachable with Tab, switchable with Space, focus ring visible.
- [ ] `prefers-reduced-motion: reduce`: no animation.
- [ ] Blog post: prose text, headings, links, inline code and code blocks readable in both themes.
- [ ] Home page: cards, divider and blog list readable in both themes.
- [ ] Browser without `:has()`: system theme works, page stays usable.

## Risks

- **Insufficient contrast**: the dark token values may miss WCAG AA contrast for muted text, links
  or the hover states, especially next to the fixed-color brand cards.
- **Flash of the wrong theme**: if the inline script in `<head>` fails or is blocked (e.g. by a
  strict Content Security Policy), the page briefly renders in the system theme before switching.
- **Missed hard-coded colors**: colors outside the listed files (e.g. in Markdown content, inline
  SVGs or third-party embeds) stay light and may become unreadable on a dark background.
