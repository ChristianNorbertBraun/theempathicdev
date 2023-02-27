const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			typography: {
				DEFAULT: {
				  css: {
					maxWidth: '80ch', // add required value here
				  }
				}
			  }
		  }
	},

	plugins: [
		require('@tailwindcss/typography'),
	]
};

module.exports = config;