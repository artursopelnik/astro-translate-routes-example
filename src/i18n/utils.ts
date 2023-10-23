import { base, configHelper } from 'config';
import { ui, defaultLang, showDefaultLang, routes, languages } from './ui';

export function getLangFromUrl(url: URL) {
  const parts: string[] = url.pathname.split('/').filter(Boolean);

  if (parts.length === 0) {
    return defaultLang;
  }

  if (configHelper.isBaseEnabled) {
    const [, lang] = parts;
    if (lang in ui) return lang as keyof typeof ui;
  } else {
    const [lang] = parts;
    if (lang in ui) return lang as keyof typeof ui;
  }

  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function useTranslatedPath(lang: keyof typeof ui) {
  return function translatePath(path: string = '', l: string = lang) {
    const isDefaultLang = !showDefaultLang && l === defaultLang;
    const isEmpty = path === '';

    // Generate home link if the path is empty
    if (isEmpty) {
      const { isTrailingSlashEnabled: isSlash, isBaseEnabled: isBase } =
        configHelper;

      const emptyRoute = `${
        isBase ? (isSlash ? '/' : '') : isSlash || isDefaultLang ? '/' : ''
      }`;

      return `${isBase ? '/' + base : ''}${
        !isDefaultLang ? '/' + l : ''
      }${emptyRoute}`;
    }

    const lTyped = l as keyof typeof routes;

    const pathName = path.replaceAll(
      '/',
      '',
    ) as keyof (typeof routes)[typeof lTyped];

    const hasTranslation =
      defaultLang !== l &&
      routes[lTyped] !== undefined &&
      routes[lTyped][pathName] !== undefined;

    const translatedPath = hasTranslation
      ? `/${routes[lTyped][pathName]}`
      : path.charAt(0) === '/'
      ? path
      : `/${path}`;

    const tpWithSubs = translatedPath.replaceAll('.', '/');

    return `${configHelper.isBaseEnabled ? '/' + base : ''}${
      !isDefaultLang ? '/' + l : ''
    }${tpWithSubs}${configHelper.isTrailingSlashEnabled ? '/' : ''}`;
  };
}

export function getRouteFromUrl(url: URL): string | undefined {
  const pathname = new URL(url)?.pathname;

  const path = pathname
    ?.split('/')
    .filter(Boolean)
    .filter((part) => !Object.keys(languages).includes(part))
    .filter((part) => {
      if (!configHelper.isBaseEnabled) {
        return true;
      }
      return !base.includes(part);
    })
    .join('.');

  if (!path) {
    return undefined;
  }

  const currentLang = getLangFromUrl(url);

  if (defaultLang === currentLang) {
    const route = Object.values(routes)[0];
    const pathTyped = path as keyof typeof route;

    return pathTyped in route ? pathTyped : undefined
  }

  const getKeyByValue = (
    obj: Record<string, string>,
    value: string,
  ): string | undefined => {
    return Object.keys(obj).find((key) => obj[key] === value);
  };

  const reversedKey = getKeyByValue(routes[currentLang], path);

  if (reversedKey !== undefined) {
    return reversedKey;
  }

  return undefined;
}

export const getLocalizedDate = (date: Date, lang: keyof typeof ui): string => {
  return lang === 'de'
    ? date.toLocaleDateString('de-DE')
    : date.toLocaleDateString('en-US');
};

export function useI18n(url: URL) {
  // Get the current language by url
  const lang = getLangFromUrl(url);

  // Get string-translation hook for my current language
  const t = useTranslations(lang);

  // Get route-translation hook for my current language
  const tp = useTranslatedPath(lang);

  // If route is empty, you will get the home url
  const homeLink = tp();

  // Get route by url or undefined
  const r = getRouteFromUrl(url);

  return { lang, t, tp, r, homeLink };
}

export const isTruthy = <V>(v?: V): v is Exclude<V, false | null | undefined | '' | 0> => Boolean(v)

export function getLanguageAlternatives(url: URL, site: URL): {
  hrefLang: string
  href: string
}[] {
  const { lang, tp, r } = useI18n(url);
  const frontPageLink = new URL(tp('', lang), site)
  const isFrontPage = url.pathname === frontPageLink.pathname

  return Object.keys(languages).map((l) => {
    return isFrontPage || r || l === lang ? {
      hrefLang: l,
      href: new URL(tp(r, l), site).toString(),
    } : undefined
  }).filter(isTruthy)
}
