/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
            },
            fontSize: {
                xxs: '10px'
            },
            keyframes: {
                'accordion-down': {
                    from: {
                        height: '0'
                    },
                    to: {
                        height: 'var(--radix-accordion-content-height)'
                    }
                },
                'accordion-up': {
                    from: {
                        height: 'var(--radix-accordion-content-height)'
                    },
                    to: {
                        height: '0'
                    }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out'
            },
            scale: {
                '75': '.75'
            },
            screens: {
                xs: '320px',
                '2xl': '1400px',
                sm: '576px',
                md: '768px',
                lg: '992px',
                xl: '1200px',
                '3xl': '1600px'
            },
            width: {
                inherit: 'inherit'
            }
        },
        boxShadow: {
            'custom-shadow': '0 4px 30px rgba(100, 186, 224, 0.3)'
        }
    },
  
    plugins: [
      function ({ addUtilities }) {
        addUtilities(
          {
            ".webkit-fill-available-width": {
              width: "-webkit-fill-available",
            },
            ".webkit-fill-available-height": {
              height: "-webkit-fill-available",
            },
          },
          ["responsive", "hover"]
        );
      },
    ],
  };
  
  