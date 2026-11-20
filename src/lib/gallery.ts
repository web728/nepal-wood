import type { StaticImageData } from 'next/image';
import e10 from '@/assets/gallery/expo-10.jpg';
import e11 from '@/assets/gallery/expo-11.jpg';
import e12 from '@/assets/gallery/expo-12.jpg';
import e13 from '@/assets/gallery/expo-13.jpg';
import e14 from '@/assets/gallery/expo-14.jpg';
import e15 from '@/assets/gallery/expo-15.jpg';
import e16 from '@/assets/gallery/expo-16.jpg';
import e18 from '@/assets/gallery/expo-18.jpg';
import e19 from '@/assets/gallery/expo-19.jpg';
import e20 from '@/assets/gallery/expo-20.jpg';
import e21 from '@/assets/gallery/expo-21.jpg';
import e22 from '@/assets/gallery/expo-22.jpg';
import e23 from '@/assets/gallery/expo-23.jpg';
import e24 from '@/assets/gallery/expo-24.jpg';
import e28 from '@/assets/gallery/expo-28.jpg';
import e29 from '@/assets/gallery/expo-29.jpg';
import e31 from '@/assets/gallery/expo-31.jpg';
import e34 from '@/assets/gallery/expo-34.jpg';
import e35 from '@/assets/gallery/expo-35.jpg';
import e36 from '@/assets/gallery/expo-36.jpg';
import e39 from '@/assets/gallery/expo-39.jpg';
import e42 from '@/assets/gallery/expo-42.jpg';
import e43 from '@/assets/gallery/expo-43.jpg';
import e44 from '@/assets/gallery/expo-44.jpg';
import e53 from '@/assets/gallery/expo-53.jpg';
import e55 from '@/assets/gallery/expo-55.jpg';
import e56 from '@/assets/gallery/expo-56.jpg';
import e57 from '@/assets/gallery/expo-57.jpg';
import e58 from '@/assets/gallery/expo-58.jpg';
import p1 from '@/assets/photos/hero-machinery-aisle.jpg';
import p2 from '@/assets/photos/demo-laser-cutter.jpg';
import p3 from '@/assets/photos/inauguration-10th.jpg';
import p4 from '@/assets/photos/machinery-hall.jpg';
import p5 from '@/assets/photos/aisle-crowd.jpg';
import p6 from '@/assets/photos/panel-saw-demo.jpg';
import p7 from '@/assets/photos/tools-booth.jpg';
import p8 from '@/assets/photos/interior-display.jpg';
import p9 from '@/assets/photos/seminar-stage.jpg';
import p10 from '@/assets/photos/b2b-meeting.jpg';

export type Shot = { src: StaticImageData; alt: string; tag: 'Show floor' | 'Machinery' | 'Materials' | 'Meetings' | 'Ceremonies & seminars' };

export const gallery: Shot[] = [
  { src: p1, alt: 'Edge banding machine and panel saw in a busy machinery aisle', tag: 'Machinery' },
  { src: p3, alt: 'Ribbon-cutting at the entrance celebrating ten years of Nepal Wood', tag: 'Ceremonies & seminars' },
  { src: e29, alt: 'Crowd watching a live woodworking machine demonstration', tag: 'Machinery' },
  { src: e34, alt: 'Veneer and laminate display wall with visitors', tag: 'Materials' },
  { src: p5, alt: 'Trade visitors walking a busy aisle of exhibitor stands', tag: 'Show floor' },
  { src: e19, alt: 'Business meeting at a machinery company stand', tag: 'Meetings' },
  { src: p2, alt: 'Visitors gathered around a laser-cutting machine', tag: 'Machinery' },
  { src: e23, alt: 'Visitor examining decorative panel samples', tag: 'Materials' },
  { src: e12, alt: 'Crowded aisle between exhibition stands', tag: 'Show floor' },
  { src: p6, alt: 'Visitors inspecting a sliding panel saw', tag: 'Machinery' },
  { src: e21, alt: 'Exhibitor showing wood samples to a visitor', tag: 'Meetings' },
  { src: p4, alt: 'Machinery hall with edge banders on display', tag: 'Machinery' },
  { src: e22, alt: 'Visitor examining fluted wall panels', tag: 'Materials' },
  { src: e56, alt: 'Organisers and partners on stage at Nepal Wood', tag: 'Ceremonies & seminars' },
  { src: e15, alt: 'Exhibitor meeting visitors at a stand table', tag: 'Meetings' },
  { src: e35, alt: 'Busy exhibition aisle with visitors', tag: 'Show floor' },
  { src: e31, alt: 'Visitor looking at a woodworking machine', tag: 'Machinery' },
  { src: p8, alt: 'Visitors studying a scale model of modular interiors', tag: 'Materials' },
  { src: e53, alt: 'Guests touring the stands during the inauguration', tag: 'Ceremonies & seminars' },
  { src: p10, alt: 'Exhibitor discussing a catalogue with buyers', tag: 'Meetings' },
  { src: e20, alt: 'Visitor inspecting door panels', tag: 'Materials' },
  { src: e18, alt: 'Visitors walking between stands', tag: 'Show floor' },
  { src: e58, alt: 'Audience at a Nepal Wood seminar', tag: 'Ceremonies & seminars' },
  { src: e14, alt: 'Visitors browsing a showroom-style stand', tag: 'Show floor' },
  { src: p7, alt: 'Visitors browsing power tools at a Bosch stand', tag: 'Machinery' },
  { src: e24, alt: 'Exhibitor desk at a doors and panels stand', tag: 'Meetings' },
  { src: e55, alt: 'Guests at a machinery stand', tag: 'Ceremonies & seminars' },
  { src: e13, alt: 'Visitors discussing panels at a stand', tag: 'Materials' },
  { src: e36, alt: 'Visitors at an exhibitor stand', tag: 'Show floor' },
  { src: e43, alt: 'Visitor at a dark panel display', tag: 'Materials' },
  { src: e28, alt: 'Visitors at a door manufacturer’s stand', tag: 'Materials' },
  { src: e10, alt: 'Visitors at an appliance stand', tag: 'Show floor' },
  { src: e11, alt: 'Visitors at a machinery stand', tag: 'Machinery' },
  { src: e16, alt: 'Visitors at a product counter', tag: 'Show floor' },
  { src: e39, alt: 'Visitors at the E3 Group stand', tag: 'Show floor' },
  { src: e42, alt: 'Visitors between stands in the hall', tag: 'Show floor' },
  { src: e44, alt: 'Visitors gathered at a stand', tag: 'Show floor' },
  { src: e57, alt: 'Certificate presentation to an exhibitor', tag: 'Ceremonies & seminars' },
  { src: p9, alt: 'Speaker addressing a seminar session', tag: 'Ceremonies & seminars' },
];
