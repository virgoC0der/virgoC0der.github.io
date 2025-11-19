module.exports = {
  content: ["./hugo_stats.json", "./themes/posthog-os/layouts/**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
