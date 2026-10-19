import React, { useEffect, useState } from 'react';
import './navbar.css';
import details from '../../assets/data.json';
import BrandLogo from '../BrandLogo/BrandLogo';
import { FaMoon, FaSun } from 'react-icons/fa6';

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'proud', label: 'Achievements' },
  { id: 'reach', label: 'Contact' },
];

const THEME_KEY = 'aa-portfolio-theme';

const Navbar = () => {
  const [active, setActive] = useState('landing');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem(THEME_KEY) || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = ['landing', ...SECTIONS.map((s) => s.id)];
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      { rootMargin: '-18% 0px -55% 0px', threshold: [0.12, 0.4, 0.65] }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setOpen(false);
  };

  const openResume = () => {
    window.open(require(`../../assets/${details.resume}`), '_blank');
  };

  return (
    <header className={`nav-split${scrolled ? ' is-scrolled' : ''}`}>
      <button type="button" className="nav-brand" onClick={() => go('landing')}>
        <BrandLogo />
        <span className="nav-name">{details['profile-name']}</span>
      </button>

      <button
        type="button"
        className="nav-burger"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
      </button>

      <nav className={`nav-pill${open ? ' is-open' : ''}`} aria-label="Primary">
        <button
          type="button"
          className="nav-theme"
          aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        >
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>

        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`nav-link${active === s.id ? ' is-active' : ''}`}
            onClick={() => go(s.id)}
          >
            {s.label}
          </button>
        ))}

        <button type="button" className="nav-resume" onClick={openResume}>
          Resume
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
