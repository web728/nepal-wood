import Link from 'next/link';
import Icon from './Icon';
import { nav, event } from '@/lib/site';

const ticker = [
  { text: 'Stall booking open for the 12th edition', live: true },
  { text: event.datesLabel },
  { text: `${event.venue.name}, ${event.venue.city}` },
  { text: 'First-ever four-day edition' },
  { text: 'Concurrent event: Hometex Nepal' },
  { text: 'Free entry for registered trade visitors' },
];

export default function Header() {
  return (
    <>
      <div className="ticker" aria-label="Event highlights">
        <div className="ticker__inner">
          {[0, 1].map((copy) => (
            <div className="ticker__track" key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {ticker.map((t) => (
                <span key={t.text} className={`ticker__item${t.live ? ' ticker__item--live' : ''}`}>{t.text}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <header className="site-header" data-header>
        <div className="container">
          <Link href="/" className="brand" aria-label="Nepal Wood International Expo, home">
            <img src="/brand/logo-12th-edition.svg" alt="Nepal Wood International Expo, 12th Edition" width={150} height={65} />
          </Link>

          <nav className="nav" aria-label="Main">
            <ul className="nav__list">
              {nav.map((item) =>
                item.items ? (
                  <li className="nav__item" key={item.label}>
                    <Link className="nav__link" href={item.items[0].href} aria-haspopup="true">
                      {item.label}
                      <Icon name="chevron" />
                    </Link>
                    <div className="nav__menu">
                      {item.items.map((s) => (
                        <Link key={s.href} href={s.href}>
                          <span>{s.label}</span>
                          {s.desc && <small>{s.desc}</small>}
                        </Link>
                      ))}
                    </div>
                  </li>
                ) : (
                  <li className="nav__item" key={item.label}>
                    <Link className="nav__link" href={item.href!}>{item.label}</Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="header-ctas">
            <Link className="btn btn--ghost btn--sm" href="/visitor-registration">Register to visit</Link>
            <Link className="btn btn--sm" href="/exhibitor-registration">Book a stand<Icon name="arrow" className="arrow" /></Link>
          </div>

          <button className="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle>
            <span className="menu-toggle__bars" />
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </header>

      <div className="mobile-menu" id="mobile-menu" data-mobile-menu>
        {nav.map((item) => (
          <div className="mobile-menu__group" key={item.label}>
            {item.items ? (
              <>
                <p className="mobile-menu__title">{item.label}</p>
                {item.items.map((s) => <Link key={s.href} href={s.href}>{s.label}</Link>)}
              </>
            ) : (
              <Link href={item.href!}>{item.label}</Link>
            )}
          </div>
        ))}
        <div className="mobile-menu__ctas">
          <Link className="btn btn--copper" href="/exhibitor-registration">Book a stand<Icon name="arrow" className="arrow" /></Link>
          <Link className="btn btn--ghost btn--on-dark" href="/visitor-registration">Register to visit, free</Link>
        </div>
      </div>
    </>
  );
}
