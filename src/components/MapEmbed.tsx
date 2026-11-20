'use client';
import { useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import Icon from './Icon';
import { event } from '@/lib/site';

// Click-to-load map: Google Maps (and its cookies) loads only when the visitor asks for it.
export default function MapEmbed({ cover }: { cover: StaticImageData }) {
  const [on, setOn] = useState(false);
  return (
    <div className="map-frame" data-reveal>
      {on ? (
        <iframe title={`Map of ${event.venue.full}`} src={event.venue.embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      ) : (
        <div className="map-frame__cover">
          <Image src={cover} alt="" fill sizes="(max-width: 900px) 100vw, 45vw" />
          <Icon name="pin" className="map-frame__pin" />
          <strong>{event.venue.full}</strong>
          <span>{event.venue.street}, {event.venue.city}</span>
          <div className="form-done__actions">
            <button type="button" className="btn btn--copper btn--sm" onClick={() => setOn(true)}>Show map</button>
            <a className="btn btn--ghost btn--sm btn--on-dark" href={event.venue.mapsUrl} target="_blank" rel="noopener">Directions<Icon name="arrow-up-right" className="arrow" /></a>
          </div>
        </div>
      )}
    </div>
  );
}
