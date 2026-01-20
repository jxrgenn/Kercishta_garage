
import React from 'react';
import {
  Activity,
  Droplets,
  Wrench,
  Cpu,
  CarFront
} from 'lucide-react';
import { Service, GalleryItem } from './types';

export const SERVICES: Service[] = [
  {
    id: 'diagnostics',
    title: 'Overall Diagnostic with OBD Scanner',
    shortDesc: 'Professional diagnostic service using advanced OBD scanning equipment to identify and resolve vehicle issues.',
    fullDesc: "Using dealer-level diagnostic hardware, we interface with your vehicle's On-Board Diagnostics (OBD) to read real-time data from every sensor and ECU. We specialize in fault code reading, sensor calibration, ECU programming, and electrical troubleshooting. We don't just read codes; we interpret data to find the root cause and provide actionable solutions.",
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
    id: 'tires-alignment',
    title: 'Tire Services & Alignment',
    shortDesc: 'Complete tire mounting, wheel changes, and precision alignment services for optimal performance and safety.',
    fullDesc: "Professional tire services including mounting, balancing, and seasonal changes. We handle all tire sizes with specialized equipment. Our wheel alignment service ensures proper tracking, even tire wear, and optimal handling. We service tires up to 20 inches with competitive pricing based on size.",
    image: 'https://images.unsplash.com/photo-1585789575347-3547e6c2f9c6?auto=format&fit=crop&q=80&w=1200',
    problems: ['Uneven tire wear', 'Vibration while driving', 'Seasonal tire changes', 'Poor handling', 'Tire mounting needed'],
    importance: 'Proper tire service and alignment are critical for vehicle safety, handling, and tire longevity. Regular maintenance prevents premature tire wear and improves fuel efficiency.',
    icon: 'Wrench'
  },
  {
    id: 'equipment-rental',
    title: 'Equipment Rental',
    shortDesc: 'Professional-grade hydraulic lifts and specialized tools available for DIY enthusiasts and independent mechanics.',
    fullDesc: "Work on your own vehicle using our professional equipment. Our workshop offers hourly hydraulic lift rental, tool cart access, and specialized tools. Perfect for DIY mechanics who need professional-grade lifting equipment and proper workspace. All rentals include basic safety equipment and workspace access.",
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=1200',
    problems: ['Need professional lift', 'Home garage too small', 'Safety concerns', 'Lack of proper equipment', 'Missing specialized tools'],
    importance: "Professional hydraulic lifts and specialized tools provide safe access to your vehicle's underside, enabling complex repairs and maintenance that would be impossible at home.",
    icon: 'CarFront'
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
  Wrench: <Wrench className="w-6 h-6" />,
  Cpu: <Cpu className="w-6 h-6" />,
  CarFront: <CarFront className="w-6 h-6" />,
};
