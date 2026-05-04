import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, Shield, Zap, Heart, Brain, 
  Stethoscope, Clock, Users, ArrowRight,
  ClipboardList, Smartphone, Microscope,
  Baby, Scissors, Bone, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { hospitalStaff } from '../services/mockDatabase';

const Home = () => {
  // Group doctors by specialization for the departments section
  const departments = [
    { 
      name: "General Physician", 
      icon: Activity, 
      desc: "Primary care & routine checkups", 
      color: "blue",
      specialists: hospitalStaff.filter(d => d.specialization === "General Physician")
    },
    { 
      name: "Cardiologist", 
      icon: Heart, 
      desc: "Expert heart care", 
      color: "red",
      specialists: hospitalStaff.filter(d => d.specialization === "Cardiologist")
    },
    { 
      name: "Neurologist", 
      icon: Brain, 
      desc: "Advanced brain treatments", 
      color: "indigo",
      specialists: hospitalStaff.filter(d => d.specialization === "Neurologist")
    },
    { 
      name: "Orthopedician", 
      icon: Bone, 
      desc: "Bone & joint specialists", 
      color: "orange",
      specialists: hospitalStaff.filter(d => d.specialization === "Orthopedician")
    },
    { 
      name: "Pediatrician", 
      icon: Baby, 
      desc: "Specialized child care", 
      color: "emerald",
      specialists: hospitalStaff.filter(d => d.specialization === "Pediatrician")
    },
    { 
      name: "Dermatologist", 
      icon: Scissors, 
      desc: "Skin & aesthetics", 
      color: "pink",
      specialists: hospitalStaff.filter(d => d.specialization === "Dermatologist")
    },
    { 
      name: "Emergency Medicine", 
      icon: Activity, 
      desc: "24/7 Urgent Care", 
      color: "rose",
      specialists: hospitalStaff.filter(d => d.specialization === "Emergency Medicine")
    }
  ];

  const facilities = [
    {
      title: "24/7 Emergency Care",
      desc: "Round-the-clock immediate medical attention for critical situations.",
      icon: Activity,
      color: "emerald"
    },
    {
      title: "Advanced Diagnostics",
      desc: "State-of-the-art diagnostic imaging and rapid pathology services.",
      icon: Microscope,
      color: "blue"
    },
    {
      title: "Modern ICUs",
      desc: "Fully equipped intensive care units with specialized monitoring.",
      icon: Heart,
      color: "rose"
    },
    {
      title: "AI Triage System",
      desc: "Instant symptom analysis and intelligent specialist routing.",
      icon: Zap,
      color: "amber"
    },
    {
      title: "Telehealth Support",
      desc: "Virtual consultations and remote monitoring for home recovery.",
      icon: Smartphone,
      color: "indigo"
    },
    {
      title: "Surgical Excellence",
      desc: "Advanced robotic and minimally invasive surgical facilities.",
      icon: Shield,
      color: "slate"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="px-6 py-6 flex items-center justify-between max-w-7xl mx-auto border-b border-slate-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl leading-none">+</span>
          </div>
          <span className="text-xl font-black tracking-tight text-slate-800">CareConnect</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#facilities" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition">Facilities</a>
          <a href="#departments" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition">Departments</a>
          <Link to="/doctor" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition">Doctor Portal</Link>
        </div>
        <Link 
          to="/portal/intake" 
          className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-black hover:bg-blue-600 transition-all shadow-lg shadow-slate-100"
        >
          Book Now
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 rounded-l-[10rem] -z-10 translate-x-1/4" />
        
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 mb-8"
          >
            <Zap size={16} className="fill-blue-600" />
            <span className="text-xs font-black uppercase tracking-widest">AI-Driven Healthcare</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8"
          >
            Your Health, Managed <br />
            <span className="text-blue-600">Intelligently.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto mb-12 font-medium"
          >
            CareConnect uses AI to understand your symptoms and instantly route 
            you to the best available specialist in our hospital.
          </motion.p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/portal/intake" className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-lg hover:bg-blue-700 transition shadow-2xl shadow-blue-100 flex items-center justify-center gap-2">
              Get Started <ArrowRight size={20} />
            </Link>
            <Link to="/doctor" className="w-full sm:w-auto px-10 py-5 bg-white text-slate-600 rounded-[2rem] font-black text-lg border-2 border-slate-100 hover:bg-slate-50 transition">
              Doctor Login
            </Link>
          </div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section id="facilities" className="px-6 py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">World-Class Facilities</h2>
             <p className="text-slate-500 font-medium">State-of-the-art medical infrastructure at your service.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className={`w-14 h-14 bg-${f.color}-50 text-${f.color}-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Our Departments & Top Specialists</h2>
              <p className="text-slate-500 mt-2 font-medium">Expert care across multiple disciplines, prioritized by AI.</p>
            </div>
            <Link to="/portal/intake" className="text-blue-600 font-black flex items-center gap-2 hover:gap-3 transition-all">
              View All Staff <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {departments.map((dept, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white border border-slate-100 rounded-[2.5rem] p-8 flex flex-col h-full hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50 transition-all"
              >
                <div className={`w-12 h-12 bg-${dept.color}-50 text-${dept.color}-600 rounded-2xl flex items-center justify-center mb-6`}>
                  <dept.icon size={24} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">{dept.name}</h3>
                <p className="text-slate-400 text-sm font-medium mb-8">{dept.desc}</p>
                
                <div className="mt-auto space-y-3">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Available Specialists</p>
                   {dept.specialists.map(doc => (
                     <div key={doc.id} className="flex items-center gap-3 group/doc">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                           <Users size={14} className="text-slate-400 group-hover/doc:text-blue-600" />
                        </div>
                        <div>
                           <p className="text-xs font-black text-slate-800">{doc.name}</p>
                           <p className="text-[10px] font-bold text-slate-400">{doc.experience} yrs experience</p>
                        </div>
                     </div>
                   ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full -mr-32 -mt-32 blur-[100px] opacity-20" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600 rounded-full -ml-32 -mb-32 blur-[100px] opacity-20" />
           
           <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight relative z-10">
             Ready for a Smarter <br className="hidden md:block" /> Healthcare Experience?
           </h2>
           <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto font-medium relative z-10">
             Join thousands of patients who trust CareConnect for instant, 
             intelligent, and specialized clinical care.
           </p>
           <Link to="/portal/intake" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-lg hover:bg-blue-50 transition shadow-2xl relative z-10">
             Start Your Intake <ChevronRight size={24} />
           </Link>
        </div>
      </section>

      <footer className="px-6 py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2 opacity-50">
              <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm leading-none">+</span>
              </div>
              <span className="font-black tracking-tight text-slate-800">CareConnect</span>
           </div>
           <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">© 2026 CareConnect Clinical Networks</p>
           <div className="flex gap-6">
              <Link to="/doctor" className="text-xs font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition">Staff Only</Link>
              <a href="#" className="text-xs font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition">Privacy</a>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
