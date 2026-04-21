import { Link } from 'react-router-dom';
import { Heart, Github, Twitter, Linkedin, Mail, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#050810] border-t border-white/[0.04] text-slate-400 relative overflow-hidden mt-0">
      {/* Decorative background blur */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/[0.03] rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/[0.03] rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 py-14 max-w-7xl relative z-10">
        
        {/* Call to Action Banner */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 mb-16 flex flex-col lg:flex-row items-center justify-between text-center lg:text-left border border-white/[0.05] bg-gradient-to-r from-blue-900/10 to-indigo-900/10">
          <div className="flex-1 mb-8 lg:mb-0 lg:pr-10">
            <div className="flex items-center justify-center lg:justify-start mb-3 space-x-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-bold uppercase tracking-[0.2em] text-xs">Join the Movement</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Elevate your academic journey.</h3>
            <p className="text-slate-400 max-w-2xl text-sm sm:text-base font-medium leading-relaxed">
              Don't navigate university alone. Join thousands of students collaborating, sharing resources, and building their professional legacy. Ignite your potential with the Communication Platform today.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300">
              Start Learning Today
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-12">
          {/* Brand Info & Mission Statement */}
          <div className="lg:col-span-2 lg:pr-8">
            <Link to="/" className="flex items-center space-x-3 mb-6 group w-fit">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                <span className="font-extrabold text-sm">CP</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold text-white leading-none tracking-tight">Communication</span>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mt-1">Platform Pro</span>
              </div>
            </Link>
            
            {/* Tagline & Mission */}
            <h4 className="text-white font-bold mb-2 text-sm">Built for students, by students.</h4>
            <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium">
              We believe brilliant minds shouldn't operate in silos. Our mission is to bridge the gap between campuses, unlocking a centralized hub for knowledge, collaboration, and student success.
            </p>
            
            <div className="flex space-x-3">
              <a href="#" aria-label="GitHub" className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-400 transition-all text-slate-500 border border-white/[0.04]">
                <Github className="w-4.5 h-4.5" />
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-400 transition-all text-slate-500 border border-white/[0.04]">
                <Twitter className="w-4.5 h-4.5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-400 transition-all text-slate-500 border border-white/[0.04]">
                <Linkedin className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm tracking-wide">Resources</h4>
            <ul className="space-y-3.5 font-medium text-sm">
              <li><Link to="/" className="text-slate-500 hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mr-2 opacity-0 -ml-3 transition-all hover:opacity-100 hover:ml-0"></span>Home Feed</Link></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mr-2 opacity-0 -ml-3 transition-all hover:opacity-100 hover:ml-0"></span>Universities</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mr-2 opacity-0 -ml-3 transition-all hover:opacity-100 hover:ml-0"></span>Departments</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mr-2 opacity-0 -ml-3 transition-all hover:opacity-100 hover:ml-0"></span>Events & Webinars</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm tracking-wide">Support</h4>
            <ul className="space-y-3.5 font-medium text-sm">
              <li><a href="#" className="text-slate-500 hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mr-2 opacity-0 -ml-3 transition-all hover:opacity-100 hover:ml-0"></span>Help Center</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mr-2 opacity-0 -ml-3 transition-all hover:opacity-100 hover:ml-0"></span>Community Guidelines</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mr-2 opacity-0 -ml-3 transition-all hover:opacity-100 hover:ml-0"></span>Privacy Policy</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mr-2 opacity-0 -ml-3 transition-all hover:opacity-100 hover:ml-0"></span>Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="lg:col-span-1">
            <h4 className="text-white font-bold mb-6 text-sm tracking-wide">Stay Updated</h4>
            
            <form className="mb-6">
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] focus:border-blue-500/30 rounded-xl py-2.5 pl-4 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-600"
                />
                <button type="button" aria-label="Subscribe" className="absolute right-2 top-2 p-1 text-slate-500 hover:text-blue-400 transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </form>

            <ul className="space-y-3 font-medium text-sm">
              <li className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mr-3 flex-shrink-0 border border-blue-500/20">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-300 font-semibold mb-0.5">Contact Us</span>
                  <a href="mailto:support@commplatform.net" className="text-slate-500 hover:text-blue-400 transition-colors text-xs">
                    support@commplatform.net
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between text-sm font-medium">
          <p className="text-slate-600 mb-4 md:mb-0 text-[13px]">
            &copy; {new Date().getFullYear()} Communication Platform. All rights reserved.
          </p>
          <div className="flex items-center text-slate-600 text-[13px] bg-white/[0.02] px-3 py-1.5 rounded-full border border-white/[0.03]">
            Crafted with <Heart className="w-3.5 h-3.5 mx-1.5 text-rose-500 fill-rose-500" /> for the student community
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
