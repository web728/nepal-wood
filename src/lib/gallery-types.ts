export const galleryTags = [
  'All',
  'Show floor',
  'Machinery',
  'Materials',
  'Meetings',
  'Ceremonies & seminars',
] as const;

export type GalleryTag = (typeof galleryTags)[number];
export type ShotTag = Exclude<GalleryTag, 'All'>;
export type Shot = { src: string; alt: string; tag: ShotTag };

