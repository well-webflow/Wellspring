/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      display: ['Inter'],
      body: ['Inter'],
    },

    extend: {
      backgroundImage: {
        'actionSecondaryBackground': "var(--actionSecondaryBackground)",
        'actionSecondaryBackgroundHover': "var(--actionSecondaryBackgroundHover)",
      },
      colors: {
        'primary': '#84c8d1',
        'primary-dark': '#3b838c',
        'background1': "var(--background1)",
        'background2': "var(--background2)",
        'background3': "var(--background3)",
        'background4': "var(--background4)",
        'background5': "var(--background5)",
        'background-input': "var(--background-input)",
        'actionPrimaryBackground': "var(--actionPrimaryBackground)",
        'actionPrimaryBackgroundHover': "var(--actionPrimaryBackgroundHover)",
        'actionPrimaryText': "var(--actionPrimaryText)",
        'actionPrimaryTextHover': "var(--actionPrimaryTextHover)",
        'actionSecondaryText': "var(--actionSecondaryText)",
        'actionSecondaryTextHover': "var(--actionSecondaryTextHover)",
        'boxShadows-action-secondary': 'var(--boxShadows-action-secondary)',
        'border1': 'var(--border1)',
        'border2': 'var(--border2)',
        'border3': 'var(--border3)',
        'text1': 'var(--text1)',
        'text2': 'var(--text2)',
        'text3': 'var(--text3)',
      },
      boxShadow: {
        'wf-input':
          '0px 1px 1px -1px rgba(0, 0, 0, 0.13) inset, 0px 3px 3px -3px rgba(0, 0, 0, 0.17) inset, 0px 4px 4px -4px rgba(0, 0, 0, 0.17) inset, 0px 8px 8px -8px rgba(0, 0, 0, 0.17) inset, 0px 12px 12px -12px rgba(0, 0, 0, 0.13) inset, 0px 16px 16px -16px rgba(0, 0, 0, 0.13) inset, 0 0 0 1px #2496ff;',
      },
      fontFamily: {
        brand: ["Radley", "serif"]
      }
    },
  },
  plugins: [],
};
