// Tailwind config for the Play CDN, mirroring shadcn/ui's tailwind.config.
// Loaded right after https://cdn.tailwindcss.com in every page.
tailwind.config = {
  darkMode: 'media',
  theme: {
    container: { center: true, padding: '2rem', screens: { '2xl': '1140px' } },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
      },
      borderColor: { DEFAULT: 'hsl(var(--border))' },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        pop: { from: { transform: 'scale(.4)', opacity: '0' }, to: { transform: 'scale(1)', opacity: '1' } },
      },
      animation: {
        pop: 'pop .6s cubic-bezier(.68,-0.55,.27,1.55)',
      },
    },
  },
};

// Render Lucide icons (<i data-lucide="name">) once the DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  if (window.lucide) window.lucide.createIcons();
});
