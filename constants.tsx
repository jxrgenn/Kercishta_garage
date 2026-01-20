
import React from 'react';
import {
  Activity,
  Droplets,
  Sparkles,
  Cpu,
  CarFront
} from 'lucide-react';
import { Service, GalleryItem } from './types';

export const SERVICES: Service[] = [
  {
    id: 'diagnostics',
    title: 'Diagnostic Failure Codes',
    shortDesc: 'Advanced engine and electronic diagnostics. We decode failure codes and repair electrical systems with precision.',
    fullDesc: "Using dealer-level diagnostic hardware, we interface with your vehicle's On-Board Diagnostics (OBD) to read real-time data from every sensor and ECU. We specialize in harness repair, sensor calibration, ECU programming, and electrical troubleshooting. We don't just read codes; we interpret data to find the root cause.",
    image: 'https://images.unsplash.com/photo-1504222490345-c075b6008014?auto=format&fit=crop&q=80&w=1200',
    problems: ['Check engine lights', 'Sensor malfunctions', 'Battery drain', 'Infotainment failure', 'Faulty sensor readings', 'DPF/EGR issues', 'Short circuits'],
    importance: 'Accurate diagnostics prevent unnecessary parts replacement. Electrical faults can be difficult to track; our systematic approach ensures a permanent fix rather than a temporary bypass.',
    icon: 'Activity'
  },
  {
    id: 'maintenance',
    title: 'Oil & Maintenance',
    shortDesc: 'Scheduled servicing that exceeds manufacturer standards.',
    fullDesc: "We don't just change oil. Our maintenance cycles include 50-point inspections, fluid analysis, and filter replacements using only premium synthetic lubricants and OEM-grade parts. Complete vehicle health checks ensure every system is operating optimally.",
    image: 'https://images.unsplash.com/photo-1635437536607-b8572f443763?auto=format&fit=crop&q=80&w=1200',
    problems: ['Old lubricants', 'Clogged filters', 'Degraded coolant', 'Service interval alerts', 'Engine wear'],
    importance: 'Consistent maintenance is the only way to ensure long-term engine reliability and resale value.',
    icon: 'Droplets'
  },
  {
    id: 'bridge-rental',
    title: 'Car Bridge Rental',
    shortDesc: 'Professional-grade hydraulic lifts available for DIY enthusiasts and independent mechanics.',
    fullDesc: 'Work on your own vehicle using our professional equipment. Our workshop offers hourly and daily bridge rental with secure, covered workspace. Perfect for DIY mechanics who need professional-grade lifting equipment. Safety equipment and basic tools available on-site.',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=1200',
    problems: ['Need professional lift', 'Home garage too small', 'Safety concerns', 'Lack of proper equipment'],
    importance: "Professional hydraulic bridges provide safe access to your vehicle's underside, enabling complex repairs and maintenance that would be impossible at home.",
    icon: 'CarFront'
  },
  {
    id: 'detailing',
    title: 'Detailing & Cleaning',
    shortDesc: 'Preserve and protect with high-end surface restoration.',
    fullDesc: 'More than a car wash. We provide multi-stage paint correction, ceramic coatings, and deep interior extraction to return your vehicle to showroom condition. Professional-grade compounds and sealants ensure lasting protection.',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=1200',
    problems: ['Paint oxidation', 'Scratches/swirls', 'Stained upholstery', 'Dull finish', 'Environmental damage'],
    importance: 'Professional detailing protects your investment against environmental degradation and maintains high resale value.',
    icon: 'Sparkles'
  }
];

export const GALLERY: GalleryItem[] = [
  { id: 1, url: 'https://images.unsplash.com/photo-1530046339160-ce3e5b085ea5?auto=format&fit=crop&q=80&w=800', caption: 'Precision engine calibration', category: 'repair' },
  { id: 2, url: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=800', caption: 'Clean workshop standards', category: 'workshop' },
  { id: 3, url: 'https://images.unsplash.com/photo-1565138146061-e29b0ad973ae?auto=format&fit=crop&q=80&w=800', caption: 'Brake assembly maintenance', category: 'repair' },
  { id: 4, url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800', caption: 'Diagnostic computer interface', category: 'diagnostics' },
  { id: 5, url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800', caption: 'High-end detailing finish', category: 'finishing' },
  { id: 6, url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800', caption: 'Performance tuning bay', category: 'workshop' },
];

export const ICON_MAP: Record<string, React.ReactNode> = {
  Activity: <Activity className="w-6 h-6" />,
  Droplets: <Droplets className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Cpu: <Cpu className="w-6 h-6" />,
  CarFront: <CarFront className="w-6 h-6" />,
};
