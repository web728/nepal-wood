import fs from "fs";
import path from "path";

export interface GalleryImage {
  src: string;
  w: number;
  h: number;
  caption?: string;
  category?: string;
}

export function getGalleryImages(): GalleryImage[] {
  const galleryDir = path.join(process.cwd(), "public/images/gallery");

  // Agar directory exist na kare toh empty array return hoga
  if (!fs.existsSync(galleryDir)) {
    return [];
  }

  // Folder ki saari real files read kar raha hai
  const files = fs.readdirSync(galleryDir);

  // Sirf images ko filter karke list bana rahe hain (.jpg, .png, .webp, .jpeg)
  const imageFiles = files.filter((file) =>
    /\.(jpg|jpeg|png|webp|JPG|PNG|WEBP)$/i.test(file)
  );

  // Files ko numerically sort kar rahe hain (img-1, img-2, img-10...)
  imageFiles.sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || "0", 10);
    const numB = parseInt(b.match(/\d+/)?.[0] || "0", 10);
    return numA - numB;
  });

  return imageFiles.map((file, i) => {
    const isPortrait = i % 3 === 0;
    const isLandscape = i % 2 === 0;

    return {
      src: `/images/gallery/${file}`,
      w: isPortrait ? 800 : isLandscape ? 1200 : 1000,
      h: isPortrait ? 1200 : isLandscape ? 800 : 1000,
      caption: `Nepal Wood Expo Showcase Image ${i + 1}`,
      category: i % 4 === 0 ? "Machinery" : i % 3 === 0 ? "Stalls" : "Demos",
    };
  });
}