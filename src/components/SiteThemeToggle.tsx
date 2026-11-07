'use client';

import { useEffect, useState } from 'react';
import Icon from './Icon';
import { store } from '@/lib/data';

type Theme = 'light' | 'dark';

/*
  Navbar light/dark switch for the whole site. Follows the device setting until the visitor picks one,
  then remembers the choice in this browser only (localStorage, no cookies).
*/
export default function SiteThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const current = (): Theme => {
      const set = document.documentElement.dataset.theme;
      return set === 'dark' || set === 'light' ? set : mq.matches ? 'dark' : 'light';
    };
    setTheme(current());
    const onSystem = () => { if (!store.get('ltf.theme')) setTheme(current()); };
    mq.addEventListener('change', onSystem);
    return () => mq.removeEventListener('change', onSystem);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    const root = document.documentElement;
    root.classList.add('no-anim'); // switch every colour at once instead of letting only some elements fade
    root.dataset.theme = next;
    window.setTimeout(() => root.classList.remove('no-anim'), 80);
    store.set('ltf.theme', next);
  };

  const label = theme === 'dark' ? 'Switch to light mode' : theme === 'light' ? 'Switch to dark mode' : 'Switch color theme';
  return (
    <button type="button" className="sq theme-btn" data-tip={label} aria-label={label} onClick={toggle}>
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
    </button>
  );
}
