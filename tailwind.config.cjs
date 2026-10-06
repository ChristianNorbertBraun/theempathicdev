const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',

	theme: {
		extend: {
			typography: (theme) => ({
				DEFAULT: {
					css: {
						maxWidth: '80ch',

						// Remove backticks from inline code
						'code:not(pre code)::before': { content: 'none' },
						'code:not(pre code)::after': { content: 'none' },

						// Inline code styling
						'code:not(pre code)': {
							backgroundColor: theme('colors.slate.200')
						},

						code: {
							borderRadius: theme('borderRadius.DEFAULT')
						},

						// Link styling
						a: {
							textDecoration: 'underline',
							textDecorationColor: theme('colors.emerald.400'),
							textDecorationThickness: '4px',
							color: theme('colors.emerald.600') // ← Add link color explicitly
						},

						// Code blocks
						pre: {
							overflowY: 'scroll'
						}
					}
				},
				// Applied together with `dark:prose-invert`
				invert: {
					css: {
						'code:not(pre code)': {
							backgroundColor: theme('colors.slate.700')
						},
						a: {
							color: theme('colors.emerald.400')
						}
					}
				}
			})
		}
	},

	plugins: [require('@tailwindcss/typography')]
};

module.exports = config;
