module.exports = {
  purge: ["./src/**/*.{html,ts}"],
  darkMode: 'class', // or 'media' or 'class'
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      backgroundImage: theme => ({
        'day': "url('assets/Images/nature-day.jpg')",
        'night': "url('assets/Images/nature-night.jpg')",
      })
    },
  },
  variants: {
    extend: {
      backgroundImage: ['dark']
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
