'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Icon from './Icon';
import { nav, event } from '@/lib/site';
import './header.css';

const highlights = [
  { text: 'Stall booking open for the 12th edition', live: true },
  { text: event.datesLabel },
  { text: `${event.venue.name}, ${event.venue.city}` },
  { text: 'First-ever four-day edition' },
  { text: 'Concurrent event: Hometex Nepal' },
  { text: 'Free entry for registered trade visitors' },
];

// Each track holds the list twice so it is always wider than the screen
// and the loop never shows an empty gap.
const trackItems = [...highlights, ...highlights];

const DESKTOP_BREAKPOINT = 1200;
const CLOSE_DELAY = 140;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const closeAll = useCallback(() => {
    clearCloseTimer();
    setOpenDropdown(null);
    setMenuOpen(false);
  }, []);

  // Any page change closes the dropdown and the mobile menu.
  useEffect(() => {
    closeAll();
    if (document.activeElement instanceof HTMLElement && navRef.current?.contains(document.activeElement)) {
      document.activeElement.blur();
    }
  }, [pathname, closeAll]);

  // Clicking outside or pressing Escape closes the desktop dropdown.
  useEffect(() => {
    if (!openDropdown) return;

    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenDropdown(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenDropdown(null);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openDropdown]);

  // Mobile menu: Escape closes it and the page behind it does not scroll.
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onEscape);
    };
  }, [menuOpen]);

  // If the screen grows to desktop size, the mobile menu should close.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > DESKTOP_BREAKPOINT) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => clearCloseTimer, []);

  const openOnHover = (label: string) => {
    clearCloseTimer();
    setOpenDropdown(label);
  };

  const closeOnLeave = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpenDropdown(null), CLOSE_DELAY);
  };

  const handleSubLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setOpenDropdown(null);
    setMenuOpen(false);
    e.currentTarget.blur();
  };

  return (
    <>
      <div className="nw-ticker" role="region" aria-label="Event highlights">
        <div className="nw-ticker__inner">
          {[0, 1].map((copy) => (
            <div className="nw-ticker__track" key={copy} aria-hidden={copy === 1}>
              {trackItems.map(({ text, live }, index) => (
                <span className={`nw-ticker__item${live ? ' nw-ticker__item--live' : ''}`} key={`${text}-${index}`}>
                  {text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <header className="nw-header" data-header>
        <div className="container nw-header__inner">
          <Link
            href="/"
            className="nw-header__brand"
            aria-label="Nepal Wood International Expo — Home"
            onClick={closeAll}
          >
            <Image
              src="/brand/logo-12th-edition.svg"
              alt="Nepal Wood International Expo, 12th Edition"
              width={178}
              height={76}
              unoptimized
              priority
            />
          </Link>

          <nav className="nw-nav" aria-label="Main navigation" ref={navRef}>
            <ul className="nw-nav__list">
              {nav.map((item) => {
                if (!item.items) {
                  return (
                    <li className="nw-nav__item" key={item.label}>
                      <Link
                        className="nw-nav__link"
                        href={item.href!}
                        aria-current={pathname === item.href ? 'page' : undefined}
                        onClick={() => setOpenDropdown(null)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }

                const isOpen = openDropdown === item.label;
                const isActive = item.items.some((child) => child.href === pathname);

                return (
                  <li
                    className={`nw-nav__item nw-nav__item--dropdown${isOpen ? ' is-open' : ''}`}
                    key={item.label}
                    onMouseEnter={() => openOnHover(item.label)}
                    onMouseLeave={closeOnLeave}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenDropdown(null);
                    }}
                  >
                    <button
                      type="button"
                      className={`nw-nav__link nw-nav__link--button${isActive ? ' is-active' : ''}`}
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                    >
                      {item.label}
                      <Icon name="chevron" />
                    </button>

                    <div className="nw-nav__menu" role="menu" aria-hidden={!isOpen}>
                      {item.items.map((child) => (
                        <Link
                          className="nw-nav__sub-link"
                          key={child.href}
                          href={child.href}
                          role="menuitem"
                          tabIndex={isOpen ? 0 : -1}
                          aria-current={pathname === child.href ? 'page' : undefined}
                          onClick={handleSubLinkClick}
                        >
                          <span>{child.label}</span>
                          {child.desc && <small>{child.desc}</small>}
                        </Link>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="nw-header__actions">
            <Link className="nw-header__button nw-header__button--outline" href="/visitor-registration" onClick={closeAll}>
              Register to visit
            </Link>
            <Link className="nw-header__button nw-header__button--solid" href="/exhibitor-registration" onClick={closeAll}>
              Book a stand <Icon name="arrow" />
            </Link>
          </div>

          <button
            className={`nw-menu-toggle${menuOpen ? ' is-open' : ''}`}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="nw-mobile-menu"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="nw-menu-toggle__bars" aria-hidden="true" />
          </button>
        </div>

        <nav
          className={`nw-mobile-menu${menuOpen ? ' is-open' : ''}`}
          id="nw-mobile-menu"
          aria-label="Mobile navigation"
          aria-hidden={!menuOpen}
          inert={!menuOpen}
        >
          <div className="nw-mobile-menu__inner">
            {nav.map((item) =>
              item.items ? (
                <details className="nw-mobile-menu__group" key={item.label}>
                  <summary>
                    {item.label}
                    <Icon name="chevron" />
                  </summary>
                  <div className="nw-mobile-menu__sub-links">
                    {item.items.map((child) => (
                      <Link
                        href={child.href}
                        onClick={closeAll}
                        key={child.href}
                        aria-current={pathname === child.href ? 'page' : undefined}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <div className="nw-mobile-menu__group" key={item.label}>
                  <Link
                    className="nw-mobile-menu__single"
                    href={item.href!}
                    onClick={closeAll}
                    aria-current={pathname === item.href ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </div>
              ),
            )}

            <div className="nw-mobile-menu__actions">
              <Link className="nw-header__button nw-header__button--solid" href="/exhibitor-registration" onClick={closeAll}>
                Book a stand <Icon name="arrow" />
              </Link>
              <Link className="nw-header__button nw-header__button--outline" href="/visitor-registration" onClick={closeAll}>
                Register to visit, free
              </Link>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}