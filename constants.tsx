
import React from 'react';
import { 
  Settings, 
  Activity, 
  Gauge, 
  Droplets, 
  Disc, 
  Compass, 
  Cpu, 
  Thermometer, 
  Sparkles, 
  Zap,
  Wind,
  Target
} from 'lucide-react';
import { Service, GalleryItem } from './types';

export const SERVICES: Service[] = [
  {
    id: 'diagnostics',
    title: 'Engine Diagnostics',
    shortDesc: 'Modern vehicles rely on complex electronics. We identify faults with digital precision.',
    fullDesc: 'Using dealer-level diagnostic hardware, we interface with your vehicle’s On-Board Diagnostics (OBD) to read real-time data from every sensor and ECU. We don’t just read codes; we interpret data to find the root cause.',
    image: 'https://images.unsplash.com/photo-1504222490345-c075b6008014?auto=format&fit=crop&q=80&w=1200',
    problems: ['Check engine lights', 'Intermittent performance loss', 'Faulty sensor readings', 'DPF/EGR issues'],
    importance: 'Accurate diagnostics prevent unnecessary parts replacement, saving you time and significant costs.',
    icon: 'Activity'
  },
  {
    id: 'mechanical',
    title: 'Mechanical Repairs',
    shortDesc: 'Heavy-duty mechanical work from engine rebuilds to transmission servicing.',
    fullDesc: 'From head gaskets to complete engine swaps, our workshop is equipped with heavy-duty lifts and specialized tooling for major mechanical interventions. We handle domestic and performance vehicles with equal rigor.',
    image: 'https://images.unsplash.com/photo-1486006396113-ad75027e2479?auto=format&fit=crop&q=80&w=1200',
    problems: ['Engine knocking', 'Oil leaks', 'Transmission slips', 'Overheating'],
    importance: 'Major mechanical issues can lead to catastrophic vehicle failure if not addressed by certified technicians.',
    icon: 'Settings'
  },
  {
    id: 'brakes',
    title: 'Brake Service',
    shortDesc: 'Total stopping power. Maintenance of pads, discs, lines, and ABS systems.',
    fullDesc: 'Safety is non-negotiable. We provide comprehensive brake system audits, replacement of pads and rotors with high-friction components, and ABS module troubleshooting.',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1200',
    problems: ['Squealing noises', 'Spongy pedal feel', 'Vibration during braking', 'Brake warning light'],
    importance: 'Brakes are your vehicle’s most critical safety component. Regular inspections are mandatory for high-performance and daily drivers.',
    icon: 'Disc'
  },
  {
    id: 'maintenance',
    title: 'Oil & Maintenance',
    shortDesc: 'Scheduled servicing that exceeds manufacturer standards.',
    fullDesc: 'We don’t just change oil. Our maintenance cycles include 50-point inspections, fluid analysis, and filter replacements using only premium synthetic lubricants and OEM-grade parts.',
    image: 'https://images.unsplash.com/photo-1635437536607-b8572f443763?auto=format&fit=crop&q=80&w=1200',
    problems: ['Old lubricants', 'Clogged filters', 'Degraded coolant', 'Service interval alerts'],
    importance: 'Consistent maintenance is the only way to ensure long-term engine reliability and resale value.',
    icon: 'Droplets'
  },
  {
    id: 'tires',
    title: 'Tires & Alignment',
    shortDesc: 'Precision mounting, balancing, and laser-guided geometry alignment.',
    fullDesc: 'We use high-precision laser alignment racks to ensure your vehicle tracks perfectly straight. Our tire service includes road-force balancing for the smoothest possible ride.',
    image: 'https://images.unsplash.com/photo-1549026312-35c72151b529?auto=format&fit=crop&q=80&w=1200',
    problems: ['Uneven tire wear', 'Vehicle pulling to one side', 'Steering wheel vibration', 'Flat spots'],
    importance: 'Proper alignment extends tire life by up to 30% and significantly improves fuel economy and safety.',
    icon: 'Target'
  },
  {
    id: 'suspension',
    title: 'Suspension & Steering',
    shortDesc: 'Restore handling precision and ride comfort.',
    fullDesc: 'Shocks, struts, control arms, and bushings—we replace worn components to restore your car’s original handling characteristics or upgrade them for performance.',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1200',
    problems: ['Poor handling', 'Bumpy ride', 'Clicking while turning', 'Excessive body roll'],
    importance: 'Worn suspension affects not just comfort, but also your car’s ability to stay planted in emergency maneuvers.',
    icon: 'Compass'
  },
  {
    id: 'ac',
    title: 'Air Conditioning',
    shortDesc: 'Recharging, leak detection, and climate control electronics.',
    fullDesc: 'We provide full AC evacuation and recharge services using R134a and R1234yf refrigerants. Our process includes UV leak detection and cabin filter sanitization.',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&q=80&w=1200',
    problems: ['Warm air from vents', 'Strange smells', 'AC compressor noise', 'Fogged windows'],
    importance: 'The AC system also manages cabin dehumidification, which is vital for visibility during winter months.',
    icon: 'Wind'
  },
  {
    id: 'electronics',
    title: 'Electronics & Sensors',
    shortDesc: 'Specialized electrical troubleshooting and module programming.',
    fullDesc: 'Modern cars are computers on wheels. We specialize in harness repair, sensor calibration, and electronic control unit (ECU) programming.',
    image: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&q=80&w=1200',
    problems: ['Battery drain', 'Infotainment failure', 'Sensor malfunctions', 'Short circuits'],
    importance: 'Electrical faults can be difficult to track; our systematic approach ensures a permanent fix rather than a temporary bypass.',
    icon: 'Cpu'
  },
  {
    id: 'tuning',
    title: 'Performance & Tuning',
    shortDesc: 'Unleash your vehicle’s potential with software and hardware upgrades.',
    fullDesc: 'From Stage 1 ECU remaps to exhaust system upgrades, we provide performance solutions that respect the mechanical limits of your engine while maximizing power and efficiency.',
    image: 'https://images.unsplash.com/photo-1605515298946-d062f2e9da53?auto=format&fit=crop&q=80&w=1200',
    problems: ['Underwhelming power', 'Poor throttle response', 'Generic factory limiters'],
    importance: 'Professional tuning ensures performance gains are achieved without sacrificing long-term reliability.',
    icon: 'Gauge'
  },
  {
    id: 'detailing',
    title: 'Detailing & Cleaning',
    shortDesc: 'Preserve and protect with high-end surface restoration.',
    fullDesc: 'More than a car wash. We provide multi-stage paint correction, ceramic coatings, and deep interior extraction to return your vehicle to showroom condition.',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=1200',
    problems: ['Paint oxidation', 'Scratches/swirls', 'Stained upholstery', 'Dull finish'],
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
  Settings: <Settings className="w-6 h-6" />,
  Activity: <Activity className="w-6 h-6" />,
  Disc: <Disc className="w-6 h-6" />,
  Droplets: <Droplets className="w-6 h-6" />,
  Compass: <Compass className="w-6 h-6" />,
  Cpu: <Cpu className="w-6 h-6" />,
  Thermometer: <Thermometer className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Gauge: <Gauge className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Wind: <Wind className="w-6 h-6" />,
  Target: <Target className="w-6 h-6" />,
};
