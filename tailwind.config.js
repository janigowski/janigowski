const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./mdx-components.tsx",
		"content/**/*.mdx",
	],

	theme: {
		extend: {
			colors: {
				brand: {
					lime: '#BBDF32',
					olive: '#595E44',
					purple: {
						dark: '#5E445E',
						darker: '#4C445E',
					},
					indigo: '#6831DE',
					pink: '#D931DE',
				},
				code: {
					bg: '#1C1C1C',
					fg: '#F5F5F5',
					accent: '#BBDF32',
					black: '#FFCC00',
					red: '#4C445E',
					green: '#BBDF32',
					yellow: '#4C445E',
					blue: '#D931DE',
					magenta: '#BBDF32',
					cyan: '#D9E2EC',
					white: '#595E44',
					brightBlack: '#FFCC00',
					brightRed: '#595E44',
					brightGreen: '#BBDF32',
					brightYellow: '#FF003C',
					brightBlue: '#5E445E',
					brightMagenta: '#6831DE',
					brightCyan: '#BBDF32',
					brightWhite: '#FFFFFF',
				}
			},
			typography: {
				DEFAULT: {
					css: {
						color: theme => theme('colors.zinc.100'),
						maxWidth: '65ch',
						h1: { color: theme => theme('colors.white') },
						h2: { color: theme => theme('colors.white') },
						h3: { color: theme => theme('colors.white') },
						h4: { color: theme => theme('colors.white') },
						h5: { color: theme => theme('colors.white') },
						h6: { color: theme => theme('colors.white') },
						strong: { color: theme => theme('colors.white') },
						blockquote: {
							color: theme => theme('colors.zinc.100'),
							borderLeftColor: theme => theme('colors.brand.lime'),
						},
						code: {
							color: theme => theme('colors.code.accent'),
							'&::before': { content: '""' },
							'&::after': { content: '""' },
						},
						'code::before': {
							content: '""',
						},
						'code::after': {
							content: '""',
						},
						pre: {
							backgroundColor: theme => theme('colors.code.bg'),
							color: theme => theme('colors.code.fg'),
							borderRadius: theme => theme('borderRadius.md'),
							padding: theme => theme('spacing.4'),
							'> code': {
								color: 'inherit',
								padding: '0',
								background: 'none',
								fontSize: '0.875em',
							},
						},
						a: {
							color: theme => theme('colors.brand.lime'),
							textDecoration: 'none',
							fontWeight: '500',
							'&:hover': {
								textDecoration: 'underline',
							},
						},
						hr: { borderColor: theme => theme('colors.zinc.800') },
						ul: {
							li: {
								'&::marker': {
									color: theme => theme('colors.zinc.400'),
								},
							},
						},
						ol: {
							li: {
								'&::marker': {
									color: theme => theme('colors.zinc.400'),
								},
							},
						},
					},
				},
				quoteless: {
					css: {
						'blockquote p:first-of-type::before': { content: 'none' },
						'blockquote p:first-of-type::after': { content: 'none' },
					},
				},
			},
			fontFamily: {
				sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
				display: ["var(--font-calsans)"],
			},
			backgroundImage: {
				"gradient-radial":
					"radial-gradient(50% 50% at 50% 50%, var(--tw-gradient-stops))",
			},
			animation: {
				"fade-in": "fade-in 3s ease-in-out forwards",
				title: "title 3s ease-out forwards",
				"fade-left": "fade-left 3s ease-in-out forwards",
				"fade-right": "fade-right 3s ease-in-out forwards",
			},
			keyframes: {
				"fade-in": {
					"0%": {
						opacity: "0%",
					},
					"75%": {
						opacity: "0%",
					},
					"100%": {
						opacity: "100%",
					},
				},
				"fade-left": {
					"0%": {
						transform: "translateX(100%)",
						opacity: "0%",
					},

					"30%": {
						transform: "translateX(0%)",
						opacity: "100%",
					},
					"100%": {
						opacity: "0%",
					},
				},
				"fade-right": {
					"0%": {
						transform: "translateX(-100%)",
						opacity: "0%",
					},

					"30%": {
						transform: "translateX(0%)",
						opacity: "100%",
					},
					"100%": {
						opacity: "0%",
					},
				},
				title: {
					"0%": {
						"line-height": "0%",
						"letter-spacing": "0.25em",
						opacity: "0",
					},
					"25%": {
						"line-height": "0%",
						opacity: "0%",
					},
					"80%": {
						opacity: "100%",
					},

					"100%": {
						"line-height": "100%",
						opacity: "100%",
					},
				},
			},
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("tailwindcss-debug-screens"),
	],
};
