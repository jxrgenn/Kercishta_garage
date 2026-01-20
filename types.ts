
export interface Service {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  problems: string[];
  importance: string;
  icon: string;
}

export interface GalleryItem {
  id: number;
  url: string;
  caption: string;
  category: 'workshop' | 'repair' | 'diagnostics' | 'finishing';
}
