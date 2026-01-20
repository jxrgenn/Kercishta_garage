
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
  Phone, Mail, MapPin, Clock, ArrowRight, ChevronRight, CheckCircle2, Menu, X,
  Instagram, Facebook, Linkedin, Monitor, Wrench, ShieldCheck, TrendingUp,
  Languages, Loader2, Lock, LayoutDashboard, History, UserCheck, Plus, Search,
  LogOut, Euro, FileText, Trash2, BarChart3, Calendar, Activity, Droplets,
  Disc, Gauge, Wind, Target, Cpu, ChevronUp
} from 'lucide-react';
import { SERVICES, ICON_MAP } from './constants';
import { Service } from './types';
import { translations, Language } from './translations';

// --- Types ---
interface Lead {
  _id?: string;
  date: string;
  name: string;
  phone: string;
  car: string;
  issue: string;
  status: 'new' | 'contacted' | 'resolved';
}

interface ServiceRecord {
  _id?: string;
  date: string;
  car: string;
  issue: string;
  solution: string;
  cost: number;
  revenue: number;
}

// --- API Helpers ---
const api = {
  async fetchLeads(token: string) {
    const res = await fetch('/api/leads', { headers: { 'Authorization': `Bearer ${token}` } });
    return res.json();
  },
  async submitLead(lead: Partial<Lead>) {
    return fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    });
  },
  async deleteLead(id: string, token: string) {
    return fetch(`/api/leads?id=${id}`, { 
      method: 'DELETE', 
      headers: { 'Authorization': `Bearer ${token}` } 
    });
  },
  async updateLeadStatus(id: string, status: string, token: string) {
    return fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ id, status })
    });
  },
  async fetchRecords(token: string) {
    const res = await fetch('/api/records', { headers: { 'Authorization': `Bearer ${token}` } });
    return res.json();
  },
  async addRecord(record: Partial<ServiceRecord>, token: string) {
    return fetch('/api/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(record)
    });
  },
  async deleteRecord(id: string, token: string) {
    return fetch(`/api/records?id=${id}`, { 
      method: 'DELETE', 
      headers: { 'Authorization': `Bearer ${token}` } 
    });
  },
  async login(password: string) {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    return data.success ? data.data : data;
  }
};

// --- Components ---

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return <motion.div className="fixed top-0 left-0 right-0 h-1 bg-red-600 origin-left z-[70]" style={{ scaleX }} />;
};

const Navbar: React.FC<{
  lang: Language, setLang: (l: Language) => void, logo: string,
  view: 'main' | 'admin', onExitAdmin: () => void
}> = ({ lang, setLang, logo, view, onExitAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || view === 'admin' ? 'bg-black/95 border-b border-zinc-800 py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="/" className="flex items-center space-x-3 group">
          <img src={logo} alt="Kërçishta Garage Logo" className="w-12 h-12 object-contain" />
          <div className="flex flex-col">
            <span className="font-extrabold text-xl uppercase text-white leading-none">Kërçishta<span className="text-red-600">Garage</span></span>
            <span className="text-[8px] font-technical uppercase tracking-[0.4em] text-zinc-500">Automotive Excellence</span>
          </div>
        </a>

        <div className="hidden md:flex items-center space-x-8">
          {view === 'main' && [t.nav_services, t.nav_pricing, t.nav_process, t.nav_contact].map((n, i) => (
            <a key={n} href={`#${['services', 'pricing', 'process', 'contact'][i]}`} className="text-xs font-technical text-zinc-400 hover:text-red-500 transition-colors uppercase tracking-[0.2em]">{n}</a>
          ))}
          <button onClick={() => setLang(lang === 'en' ? 'de' : 'en')} className="flex items-center space-x-2 text-zinc-500 hover:text-white transition-colors text-xs font-technical uppercase">
            <Languages size={14} /> <span>{lang === 'en' ? 'DE' : 'EN'}</span>
          </button>
          {view === 'main' ? (
            <a href="#booking" className="bg-red-600 hover:bg-white hover:text-black text-white px-6 py-3 text-xs font-black uppercase transition-all shadow-xl">{t.nav_book}</a>
          ) : (
            <button onClick={onExitAdmin} className="text-zinc-400 hover:text-red-500 flex items-center space-x-2 text-xs font-black uppercase tracking-widest transition-colors">
              <LogOut size={16} /> <span>Exit System</span>
            </button>
          )}
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X size={28} /> : <Menu size={28} />}</button>
      </div>
    </nav>
  );
};

const AdminDashboard: React.FC<{
  lang: Language, token: string, onLogout: () => void
}> = ({ lang, token, onLogout }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [history, setHistory] = useState<ServiceRecord[]>([]);
  const [tab, setTab] = useState<'leads' | 'ops' | 'analytics'>('leads');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [leadFilter, setLeadFilter] = useState({ status: 'all', search: '' });
  const [opsFilter, setOpsFilter] = useState({ search: '', profitFilter: 'all', dateRange: 'all' });
  const t = translations[lang];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [l, h] = await Promise.all([api.fetchLeads(token), api.fetchRecords(token)]);
      setLeads(l);
      setHistory(h);
    } catch (e) { console.error(e); onLogout(); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const stats = useMemo(() => {
    const revenue = history.reduce((acc, curr) => acc + Number(curr.revenue), 0);
    const cost = history.reduce((acc, curr) => acc + Number(curr.cost), 0);
    return { revenue, cost, profit: revenue - cost };
  }, [history]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const statusMatch = leadFilter.status === 'all' || lead.status === leadFilter.status;
      const searchMatch = leadFilter.search === '' ||
        lead.name.toLowerCase().includes(leadFilter.search.toLowerCase()) ||
        lead.car.toLowerCase().includes(leadFilter.search.toLowerCase()) ||
        lead.phone.includes(leadFilter.search);
      return statusMatch && searchMatch;
    });
  }, [leads, leadFilter]);

  const filteredHistory = useMemo(() => {
    return history.filter(record => {
      const profit = Number(record.revenue) - Number(record.cost);
      const searchMatch = opsFilter.search === '' ||
        record.car.toLowerCase().includes(opsFilter.search.toLowerCase()) ||
        record.issue.toLowerCase().includes(opsFilter.search.toLowerCase()) ||
        record.solution.toLowerCase().includes(opsFilter.search.toLowerCase());
      const profitMatch = opsFilter.profitFilter === 'all' ||
        (opsFilter.profitFilter === 'profit' && profit > 0) ||
        (opsFilter.profitFilter === 'loss' && profit <= 0);

      let dateMatch = true;
      if (opsFilter.dateRange !== 'all') {
        const recordDate = new Date(record.date);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));

        if (opsFilter.dateRange === 'week') dateMatch = daysDiff <= 7;
        else if (opsFilter.dateRange === 'month') dateMatch = daysDiff <= 30;
        else if (opsFilter.dateRange === 'quarter') dateMatch = daysDiff <= 90;
      }

      return searchMatch && profitMatch && dateMatch;
    });
  }, [history, opsFilter]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black"><Loader2 className="animate-spin text-red-600" size={48}/></div>;

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-zinc-950 border border-zinc-900 p-10 shadow-xl"><p className="text-[10px] font-technical text-zinc-600 uppercase mb-4">Gross Revenue</p><p className="text-4xl font-black text-white">{stats.revenue.toLocaleString()} €</p></div>
          <div className="bg-zinc-950 border border-zinc-900 p-10 shadow-xl"><p className="text-[10px] font-technical text-zinc-600 uppercase mb-4">Operations Cost</p><p className="text-4xl font-black text-zinc-400">-{stats.cost.toLocaleString()} €</p></div>
          <div className="bg-zinc-950 border border-zinc-900 p-10 shadow-xl"><p className="text-[10px] font-technical text-zinc-600 uppercase mb-4">Net Yield</p><p className="text-4xl font-black text-red-600">+{stats.profit.toLocaleString()} €</p></div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:space-x-2 sm:gap-0 bg-zinc-900 p-1 border border-zinc-800 mb-10 w-full sm:w-fit">
          <button onClick={() => setTab('leads')} className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all ${tab === 'leads' ? 'bg-red-600 text-white shadow-xl' : 'text-zinc-500 hover:text-white'}`}>Leads</button>
          <button onClick={() => setTab('ops')} className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all ${tab === 'ops' ? 'bg-red-600 text-white shadow-xl' : 'text-zinc-500 hover:text-white'}`}>Operations</button>
          <button onClick={() => setTab('analytics')} className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all ${tab === 'analytics' ? 'bg-red-600 text-white shadow-xl' : 'text-zinc-500 hover:text-white'}`}>Analytics</button>
        </div>

        {tab === 'ops' && (
          <button onClick={() => setShowForm(!showForm)} className="mb-8 bg-white text-black px-8 py-4 font-black uppercase text-[10px] flex items-center transition-all hover:bg-red-600 hover:text-white">
            <Plus size={18} className="mr-2"/> New Entry
          </button>
        )}

        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-12 overflow-hidden bg-zinc-900 p-10 border-l-4 border-red-600">
            <form className="grid md:grid-cols-4 gap-6" onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget as HTMLFormElement);
              await api.addRecord({
                date: new Date().toLocaleDateString(),
                car: fd.get('car') as string,
                issue: fd.get('issue') as string,
                solution: fd.get('solution') as string,
                cost: Number(fd.get('cost')),
                revenue: Number(fd.get('revenue')),
              }, token);
              setShowForm(false);
              fetchData();
            }}>
              <input required name="car" placeholder="CAR" className="bg-black border border-zinc-800 p-4 text-white text-sm outline-none focus:border-red-600" />
              <input required name="issue" placeholder="ISSUE" className="bg-black border border-zinc-800 p-4 text-white text-sm outline-none focus:border-red-600" />
              <input required name="solution" placeholder="FIX" className="bg-black border border-zinc-800 p-4 text-white text-sm outline-none focus:border-red-600" />
              <div className="grid grid-cols-2 gap-4">
                <input required name="cost" type="number" placeholder="COST" className="bg-black border border-zinc-800 p-4 text-white text-sm outline-none focus:border-red-600" />
                <input required name="revenue" type="number" placeholder="REV" className="bg-black border border-zinc-800 p-4 text-white text-sm outline-none focus:border-red-600" />
              </div>
              <button type="submit" className="bg-red-600 text-white font-black uppercase p-4 text-xs md:col-span-4 hover:bg-white hover:text-black transition-all">Commit to Protocol</button>
            </form>
          </motion.div>
        )}

        {tab === 'leads' && (
          <div className="mb-8 bg-zinc-950 border border-zinc-900 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-technical text-zinc-600 uppercase mb-2 block">Search</label>
                <input
                  type="text"
                  placeholder="Name, phone, car..."
                  value={leadFilter.search}
                  onChange={(e) => setLeadFilter({ ...leadFilter, search: e.target.value })}
                  className="w-full bg-black border border-zinc-800 p-3 text-white text-sm outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="text-[10px] font-technical text-zinc-600 uppercase mb-2 block">Status</label>
                <select
                  value={leadFilter.status}
                  onChange={(e) => setLeadFilter({ ...leadFilter, status: e.target.value })}
                  className="w-full bg-black border border-zinc-800 p-3 text-white text-sm outline-none focus:border-red-600"
                >
                  <option value="all">All Leads</option>
                  <option value="new">New Only</option>
                  <option value="contacted">Engaged Only</option>
                  <option value="resolved">Archived Only</option>
                </select>
              </div>
            </div>
            <div className="mt-4 text-[10px] text-zinc-600 font-technical uppercase">
              Showing {filteredLeads.length} of {leads.length} leads
            </div>
          </div>
        )}

        {tab === 'ops' && (
          <div className="mb-8 bg-zinc-950 border border-zinc-900 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-technical text-zinc-600 uppercase mb-2 block">Search</label>
                <input
                  type="text"
                  placeholder="Car, issue, solution..."
                  value={opsFilter.search}
                  onChange={(e) => setOpsFilter({ ...opsFilter, search: e.target.value })}
                  className="w-full bg-black border border-zinc-800 p-3 text-white text-sm outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="text-[10px] font-technical text-zinc-600 uppercase mb-2 block">Profit/Loss</label>
                <select
                  value={opsFilter.profitFilter}
                  onChange={(e) => setOpsFilter({ ...opsFilter, profitFilter: e.target.value })}
                  className="w-full bg-black border border-zinc-800 p-3 text-white text-sm outline-none focus:border-red-600"
                >
                  <option value="all">All Operations</option>
                  <option value="profit">Profitable Only</option>
                  <option value="loss">Loss/Break-even</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-technical text-zinc-600 uppercase mb-2 block">Date Range</label>
                <select
                  value={opsFilter.dateRange}
                  onChange={(e) => setOpsFilter({ ...opsFilter, dateRange: e.target.value })}
                  className="w-full bg-black border border-zinc-800 p-3 text-white text-sm outline-none focus:border-red-600"
                >
                  <option value="all">All Time</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="quarter">Last 90 Days</option>
                </select>
              </div>
            </div>
            <div className="mt-4 text-[10px] text-zinc-600 font-technical uppercase">
              Showing {filteredHistory.length} of {history.length} operations
            </div>
          </div>
        )}

        <div className="bg-zinc-950 border border-zinc-900 overflow-hidden shadow-2xl">
          {tab === 'leads' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="bg-zinc-900 text-[10px] font-technical uppercase text-zinc-500 tracking-widest"><th className="p-8">Client</th><th className="p-8">Car</th><th className="p-8">Status</th><th className="p-8 text-right">Action</th></tr></thead>
                <tbody className="divide-y divide-zinc-900">
                  {filteredLeads.map(lead => (
                    <tr key={lead._id} className="hover:bg-zinc-900/50">
                      <td className="p-8"><div className="font-bold text-white uppercase">{lead.name}</div><div className="text-zinc-600 text-[10px]">{lead.phone}</div></td>
                      <td className="p-8 text-zinc-400 text-xs">{lead.car}</td>
                      <td className="p-8">
                        <select value={lead.status} onChange={async (e) => { await api.updateLeadStatus(lead._id!, e.target.value, token); fetchData(); }} className="bg-black border border-zinc-800 text-[10px] p-2 text-white outline-none">
                          <option value="new">NEW</option><option value="contacted">ENGAGED</option><option value="resolved">ARCHIVED</option>
                        </select>
                      </td>
                      <td className="p-8 text-right"><button onClick={async () => { if(confirm('Delete lead?')) { await api.deleteLead(lead._id!, token); fetchData(); } }} className="text-zinc-800 hover:text-red-600 transition-colors"><Trash2 size={16}/></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : tab === 'ops' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="bg-zinc-900 text-[10px] font-technical uppercase text-zinc-500 tracking-widest"><th className="p-8">Date</th><th className="p-8">Vehicle</th><th className="p-8">Protocol</th><th className="p-8">Economics</th><th className="p-8 text-right">Action</th></tr></thead>
                <tbody className="divide-y divide-zinc-900">
                  {filteredHistory.map(h => (
                    <tr key={h._id} className="hover:bg-zinc-900/50">
                      <td className="p-8 text-xs font-technical text-zinc-600">{h.date}</td>
                      <td className="p-8 font-black uppercase text-white tracking-tighter">{h.car}</td>
                      <td className="p-8 text-zinc-400 text-xs italic">{h.issue} → {h.solution}</td>
                      <td className="p-8 text-red-600 font-black text-lg">{(h.revenue - h.cost).toLocaleString()}€</td>
                      <td className="p-8 text-right"><button onClick={async () => { if(confirm('Delete record?')) { await api.deleteRecord(h._id!, token); fetchData(); } }} className="text-zinc-800 hover:text-red-600 transition-colors"><Trash2 size={16}/></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <div className="p-20 text-center text-zinc-600 uppercase font-technical tracking-widest text-xs">Analytics Processing System Active. Monitoring flow...</div>
          )}
        </div>
      </div>
    </div>
  );
};

const ServiceCard: React.FC<{ service: Service, index: number, lang: Language }> = ({ service, index, lang }) => {
  const t = translations[lang];
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.5,
        ease: "easeOut"
      }}
      className="group bg-[#0c0c0c] p-6 sm:p-10 lg:p-12 hover:border-red-600/40 border border-transparent transition-all flex flex-col h-full relative"
    >
      <div className="text-red-600 mb-4 sm:mb-6 lg:mb-10 transform group-hover:scale-110 transition-transform origin-left">{ICON_MAP[service.icon]}</div>
      <h3 className="text-sm sm:text-lg lg:text-2xl font-black text-white uppercase mb-2 sm:mb-3 lg:mb-4 tracking-tighter group-hover:text-red-500 transition-colors leading-tight">{service.title}</h3>
      <p className="text-zinc-500 mb-4 sm:mb-6 lg:mb-10 text-xs sm:text-sm flex-grow leading-relaxed">{service.shortDesc}</p>
      <a href={`#service-${service.id}`} className="inline-flex items-center text-white font-bold uppercase text-[8px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] group-hover:text-red-500 transition-colors">
        <span className="hidden sm:inline">{t.full_protocol}</span><span className="sm:hidden">Details</span> <ChevronRight size={12} className="ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" />
      </a>
    </motion.div>
  );
};

const DetailedService: React.FC<{ service: Service, reverse?: boolean }> = ({ service, reverse }) => {
  return (
    <section id={`service-${service.id}`} className="py-32 border-b border-zinc-900 scroll-mt-20 bg-black">
      <div className={`max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative overflow-hidden group">
          <img src={service.image} alt={service.title} className="w-full aspect-video object-cover grayscale brightness-50 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-1000" />
          <div className="absolute inset-0 border-[20px] border-black/40 pointer-events-none group-hover:border-[10px] transition-all duration-500"></div>
        </motion.div>
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase mb-8 tracking-tighter leading-none">{service.title}</h2>
          <p className="text-xl text-zinc-400 mb-12 font-light leading-relaxed">{service.fullDesc}</p>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="p-8 bg-zinc-950 border border-zinc-900 border-l-red-600">
              <h4 className="text-red-600 font-black uppercase text-[10px] mb-4 tracking-widest">Failures Fixed</h4>
              <ul className="space-y-3">{service.problems.map((p, i) => <li key={i} className="text-zinc-500 text-sm italic">- {p}</li>)}</ul>
            </div>
            <div className="p-8 bg-zinc-950 border border-zinc-900 border-l-red-600">
              <h4 className="text-red-600 font-black uppercase text-[10px] mb-4 tracking-widest">Criticality</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">{service.importance}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Main App ---

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const logo = '/KC_garage.jpg'; // Static logo path
  const [view, setView] = useState<'main' | 'admin'>(window.location.pathname === '/admin' ? 'admin' : 'main');
  const [token, setToken] = useState<string | null>(sessionStorage.getItem('kg_token'));
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    const handlePopState = () => setView(window.location.pathname === '/admin' ? 'admin' : 'main');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.login(loginPass);
    if (res.token) {
      setToken(res.token);
      sessionStorage.setItem('kg_token', res.token);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setToken(null);
    sessionStorage.removeItem('kg_token');
    window.location.href = '/';
  };

  return (
    <div className="bg-[#050505] text-[#f4f4f4] min-h-screen selection:bg-red-600">
      <ScrollProgress />
      <Navbar lang={lang} setLang={setLang} logo={logo} view={view} onExitAdmin={handleLogout} />
      
      <main>
        {view === 'main' ? (
          <>
            <Hero lang={lang} />
            
            {/* Real Stats Overview */}
            <section className="bg-black py-20 border-y border-zinc-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12">
                {[
                  { label: t.stats_jobs, value: '12,500+' },
                  { label: t.stats_uptime, value: '99.8%' },
                  { label: t.stats_parts, value: t.stats_oem },
                  { label: t.stats_techs, value: '8 Certified' },
                ].map((stat, i) => (
                  <div key={i} className="text-center lg:text-left">
                    <p className="text-zinc-600 font-technical text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.4em] mb-2">{stat.label}</p>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase break-words">{stat.value}</p>
                  </div>
                ))}
              </div>
            </section>
            
            {/* RESTORED: Services Grid */}
            <section id="services" className="py-32">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
                  <div className="max-w-2xl">
                    <span className="text-red-600 font-technical text-xs font-black uppercase tracking-[0.5em] block mb-6">{t.services_title}</span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-none">Advanced <br /><span className="text-red-600">Expertise</span></h2>
                  </div>
                  <p className="text-zinc-500 max-w-sm font-light text-xl leading-relaxed italic border-l-2 border-zinc-800 pl-8">{t.services_subtitle}</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-zinc-900 border border-zinc-900 shadow-2xl">
                  {SERVICES.map((service, i) => (
                    <ServiceCard key={service.id} service={service} index={i} lang={lang} />
                  ))}
                </div>
              </div>
            </section>

            <PricingSection lang={lang} />

            {/* RESTORED: Deep Service Protocols */}
            {SERVICES.slice(0, 4).map((s, i) => (
              <DetailedService key={s.id} service={s} reverse={i % 2 !== 0} />
            ))}

            <section id="booking" className="py-32 bg-[#050505]">
              <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-32">
                <div>
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase mb-10 tracking-tighter">{t.booking_title}</h2>
                  <p className="text-xl text-zinc-500 mb-16 font-light leading-relaxed">{t.booking_sub}</p>
                  <div className="flex group mb-12 items-center">
                    <div className="w-16 h-16 bg-zinc-900 flex items-center justify-center mr-8 group-hover:border-red-600 transition-colors"><Phone className="text-red-600" size={28}/></div>
                    <p className="text-4xl font-black group-hover:text-red-600 transition-colors">+49 731 123 4567</p>
                  </div>
                  <div className="flex group items-center mb-12">
                    <div className="w-16 h-16 bg-zinc-900 flex items-center justify-center mr-8 group-hover:border-red-600 transition-colors"><MapPin className="text-red-600" size={28}/></div>
                    <p className="text-xl font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Dieselstraße 42, 89231 Neu-Ulm</p>
                  </div>
                  <div className="w-full h-64 bg-zinc-950 border border-zinc-900 overflow-hidden shadow-2xl">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2649.8!2d10.0052!3d48.3857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479967b7c0c0c0c0%3A0x0!2sDieselstra%C3%9Fe%2042%2C%2089231%20Neu-Ulm%2C%20Germany!5e0!3m2!1sen!2sus!4v1234567890"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Kërçishta Garage Location"
                    />
                  </div>
                </div>

                <div className="bg-zinc-950 p-12 border border-zinc-900 shadow-2xl relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[60px] pointer-events-none"></div>
                  {submitted ? (
                    <div className="py-20 text-center"><CheckCircle2 className="mx-auto text-red-600 mb-8" size={64}/><h3 className="text-3xl font-black uppercase text-white">Confirmed</h3><p className="text-zinc-500">Stand by for engagement.</p></div>
                  ) : (
                    <form onSubmit={async (e) => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); await api.submitLead(Object.fromEntries(fd)); setSubmitted(true); }} className="space-y-8">
                      <input name="name" required placeholder="NAME" className="w-full bg-black border border-zinc-800 p-5 text-white outline-none focus:border-red-600 transition-all" />
                      <input name="phone" required placeholder="PHONE" className="w-full bg-black border border-zinc-800 p-5 text-white outline-none focus:border-red-600 transition-all" />
                      <input name="car" required placeholder="CAR (MODEL/YEAR)" className="w-full bg-black border border-zinc-800 p-5 text-white outline-none focus:border-red-600 transition-all" />
                      <textarea name="issue" rows={4} className="w-full bg-black border border-zinc-800 p-5 text-white outline-none focus:border-red-600 transition-all" placeholder="DESCRIBE THE ISSUE"></textarea>
                      <button type="submit" className="w-full bg-red-600 text-white p-6 font-black uppercase text-xl shadow-xl hover:bg-white hover:text-black transition-all">Submit Protocol</button>
                    </form>
                  )}
                </div>
              </div>
            </section>
          </>
        ) : (
          !token ? (
            <div className="min-h-screen flex items-center justify-center bg-black px-6">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full p-12 bg-zinc-950 border border-zinc-900 text-center shadow-[0_0_100px_rgba(220,38,38,0.1)]">
                <Lock className="mx-auto text-red-600 mb-8" size={48}/>
                <h2 className="text-2xl font-black uppercase text-white mb-10 tracking-widest">{t.dashboard_login_title}</h2>
                <form onSubmit={handleLogin} className="space-y-8">
                  <input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder={t.dashboard_pass_placeholder} className="w-full bg-black border border-zinc-800 p-6 text-white text-center mb-6 focus:border-red-600 outline-none tracking-[0.5em]" />
                  {loginError && <p className="text-red-600 text-[10px] font-technical uppercase tracking-widest mb-6 bg-red-600/10 p-4 border border-red-600/20">Authentication Failed: Unauthorized Node</p>}
                  <button type="submit" className="w-full bg-red-600 text-white p-6 font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl">Verify Node Access</button>
                </form>
                <button onClick={() => window.location.href = '/'} className="mt-8 text-zinc-700 hover:text-white transition-colors text-[10px] font-technical uppercase tracking-widest">Return to Public Root</button>
              </motion.div>
            </div>
          ) : (
            <AdminDashboard lang={lang} token={token} onLogout={handleLogout} />
          )
        )}
      </main>

      <footer className="bg-black border-t border-zinc-900 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-20 mb-32">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-10">
                <img src={logo} alt="Kërçishta Garage Logo" className="w-12 h-12 object-contain" />
                <span className="font-extrabold text-2xl uppercase">Kërçishta<span className="text-red-600">Garage</span></span>
              </div>
              <p className="text-zinc-500 max-w-sm mb-12 font-light leading-relaxed">{t.footer_desc}</p>
              <div className="flex space-x-10">
                <Instagram className="text-zinc-700 hover:text-red-600 transition-colors cursor-pointer" />
                <Facebook className="text-zinc-700 hover:text-red-600 transition-colors cursor-pointer" />
                <Linkedin className="text-zinc-700 hover:text-red-600 transition-colors cursor-pointer" />
              </div>
            </div>
            <div>
              <h4 className="text-white font-black uppercase text-xs mb-10 tracking-[0.4em]">Index</h4>
              <ul className="space-y-6 text-[10px] uppercase font-technical tracking-widest">
                <li><a href="#services" className="text-zinc-600 hover:text-red-600 transition-colors">Services</a></li>
                <li><a href="#pricing" className="text-zinc-600 hover:text-red-600 transition-colors">Pricing</a></li>
                <li><a href="#booking" className="text-zinc-600 hover:text-red-600 transition-colors">Booking</a></li>
              </ul>
            </div>
            <div>
               <h4 className="text-white font-black uppercase text-xs mb-10 tracking-[0.4em]">Operational Node</h4>
               <p className="text-zinc-700 text-[10px] font-technical uppercase leading-loose tracking-widest">Dieselstraße 42, 89231 Neu-Ulm, Germany</p>
            </div>
          </div>
          <div className="pt-16 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-technical uppercase text-zinc-800 tracking-[0.4em]">
            <p>© {new Date().getFullYear()} Kërçishta Garage Engineering. All systems active.</p>
            <p className="flex items-center">{t.made_by} <a href="https://jxsoft.al" target="_blank" className="text-zinc-600 hover:text-red-600 font-bold ml-2 transition-colors">jxsoft.al</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const Hero: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = translations[lang];
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '80px 80px' }}></div>
      <div className="absolute top-0 right-0 w-[60%] h-full bg-red-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
          <div className="inline-flex items-center space-x-3 px-6 py-2 bg-zinc-900/80 border border-zinc-800 rounded-full mb-10 shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span className="text-zinc-400 font-technical text-[10px] uppercase tracking-[0.4em]">{t.hero_tag}</span>
          </div>
          <h1 className="text-6xl md:text-[8rem] font-black text-white uppercase leading-[0.85] mb-10 tracking-tighter">
            {t.hero_title_1}<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-zinc-400">{t.hero_title_2}</span>
          </h1>
          <p className="text-lg md:text-2xl text-zinc-500 mb-14 max-w-xl mx-auto font-light leading-relaxed">{t.hero_subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="#booking" className="bg-red-600 hover:bg-white hover:text-black text-white px-12 py-6 text-lg font-black uppercase shadow-2xl transition-all transform hover:-translate-y-1">{t.hero_cta_book}</a>
            <a href="#services" className="border-2 border-zinc-800 text-white hover:border-zinc-400 px-12 py-6 text-lg font-black uppercase bg-black/40 backdrop-blur-sm transition-all transform hover:-translate-y-1">{t.hero_cta_services}</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const PricingSection: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = translations[lang];
  const items = [
    { name: lang === 'en' ? "Full Diagnostics" : "Komplette Diagnose", price: "99", icon: <Monitor size={20}/> },
    { name: lang === 'en' ? "Standard Service" : "Standard-Service", price: "189", icon: <Droplets size={20}/> },
    { name: lang === 'en' ? "Brake Overhaul" : "Bremsenservice", price: "120", icon: <Disc size={20}/> },
    { name: lang === 'en' ? "Stage 1 Tuning" : "Stufe 1 Tuning", price: "450", icon: <Gauge size={20}/> },
    { name: lang === 'en' ? "AC Recharge" : "Klima-Service", price: "79", icon: <Wind size={20}/> },
    { name: lang === 'en' ? "Laser Alignment" : "Achsvermessung", price: "85", icon: <Target size={20}/> },
  ];
  return (
    <section id="pricing" className="py-32 bg-[#080808] border-y border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-24">
          <span className="text-red-600 font-technical text-xs font-black uppercase tracking-[0.5em] block mb-6">{t.nav_pricing}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-6">{t.pricing_title}</h2>
          <p className="text-zinc-500 font-light leading-relaxed">{t.pricing_sub}</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900">
          {items.map((item, i) => (
            <div key={i} className="p-8 sm:p-12 bg-black hover:bg-zinc-950 transition-all group cursor-default flex flex-col items-center text-center">
              <div className="text-zinc-800 mb-6 sm:mb-8 group-hover:text-red-600 transition-colors duration-500">{item.icon}</div>
              <h4 className="text-zinc-400 font-bold uppercase text-[10px] sm:text-xs tracking-[0.2em] mb-4 group-hover:text-white transition-colors">{item.name}</h4>
              <div className="flex items-baseline justify-center space-x-2">
                <span className="text-white text-4xl sm:text-5xl font-black">{item.price}</span>
                <span className="text-red-600 font-black text-xl sm:text-2xl group-hover:translate-x-1 transition-transform inline-block">€</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
