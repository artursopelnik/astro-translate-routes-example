export const languages = {
  de: 'Deutsch',
  en: 'English',
};

export const defaultLang = 'de';

// whether the defaultLang should show up in the url just as other locales.
export const showDefaultLang = false;

export const ui = {
  de: {
    'nav.blog': 'Blog',
    'nav.kontakt': 'Kontakt',
    'willkommen-zu-astro': 'Wilkommen zu Astro',
  },
  en: {
    'nav.blog': 'Blog',
    'nav.kontakt': 'Contact',
    'willkommen-zu-astro': 'Welcome to Astro',
  },
} as const;

export const routes = {
  en: {
    kontakt: 'contact',
    blog: 'blog',
    'blog.hallo-welt': 'blog.hello-world',
  },
};
