/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';
module.exports = {
	darkMode: 'class',
	content: [
		'./pages/**/*.{js,jsx}',
		'./components/**/*.{js,jsx}',
		'./app/**/*.{js,jsx}',
		'./src/**/*.{js,jsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		screens: {
			xxs: "370px",
			xs: '400px',
		},
		},
		extend: {
			fontFamily: {
				fontRaffle: ['var(--font-raffle)', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'var(--primary)',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				backgroundRaffle: {
					DEFAULT: 'var(--background-raffle)',
				},
				cardRaffle: {
					DEFAULT: 'var(--card-raffle)',
				},
				lightColorTint: {
					DEFAULT: 'var(--light-color-tint)',
				},
				lightTint: {
					DEFAULT: 'var(--light-tint)',
				},
				borderRaffle: {
					DEFAULT: 'var(--border-raffle)',
				},
				headerRaffle: {
					DEFAULT: 'var(--header-raffle)',
					foreground: 'var(--header-raffle-foreground)',
				},
				colorRaffle: {
					DEFAULT: 'var(--color-raffle)',
					foreground: 'var(--color-raffle-foreground)',
					300: 'var(--color-raffle-300)',
					400: 'var(--color-raffle-400)',
					500: 'var(--color-raffle-500)',
					600: 'var(--color-raffle-600)',
					700: 'var(--color-raffle-700)',
				},
				primaryRaffle: {
					DEFAULT: 'var(--primary-raffle)',
					foreground: 'var(--primary-raffle-foreground)',
					300: 'var(--primary-raffle-300)',
					400: 'var(--primary-raffle-400)',
					500: 'var(--primary-raffle-500)',
					600: 'var(--primary-raffle-600)',
					700: 'var(--primary-raffle-700)',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
			screens: {
				xxs: "430px",
				xs: '550px',
				customLg: '1100px',
			  },
		},
	},
	plugins: [
		require('tailwindcss-animate'),
		plugin(({ addVariant }) => {
			addVariant('dark', '&:where(.dark, .dark *)');
		  })],
};
