/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
      extend: {
        fontFamily: {
            OpenSans: ["OpenSans", "sans-serif"],
            OpenSansBold: ["OpenSans-Bold", "sans-serif"],
            OpenSansExtraBold: ["OpenSans-ExtraBold", "sans-serif"],
            OpenSansLight: ["OpenSans-Light", "sans-serif"],
            OpenSansMedium: ["OpenSans-Medium", "sans-serif"],
            OpenSansSemiBold: ["OpenSans-SemiBold", "sans-serif"],
          },
      },
    },
    plugins: [],
  }
