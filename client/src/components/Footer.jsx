import { Link } from 'react-router-dom';
import { Heart, Github, Twitter, Linkedin, Mail, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#050810] border-t border-white/[0.04] text-slate-400 relative overflow-hidden mt-0">
      {/* Decorative background blur */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/[0.03] rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/[0.03] rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 py-14 max-w-7xl relative z-10">
        
        {/* Motivational Banner */}
        <div className="glass-card rounded-2xl p-8 mb-14 flex flex-col items-center text-center">
          <div className="w-11 h-11 bg-white/[0.04] rounded-xl flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-3">Your future starts here.</h3>
          <p className="text-slate-500 max-w-2xl text-sm sm:text-base font-medium leading-relaxed">
            "The beautiful thing about learning is that no one can take it away from you." <br /> 
            Connect, grow, and build your legacy with the Arsi Aseko Network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-5 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
                <span className="font-extrabold text-sm">AA</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold text-white leading-none tracking-tight">Arsi Aseko</span>
                <span className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.2em] mt-0.5">Nexus Pro</span>
              </div>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed mb-5 font-medium">
              A premium platform to connect students from across Arsi Aseko universities. Share ideas, collaborate, and evolve.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-400 transition-all text-slate-600 border border-white/[0.04]">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-400 transition-all text-slate-600 border border-white/[0.04]">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-400 transition-all text-slate-600 border border-white/[0.04]">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm tracking-wide">Resources</h4>
            <ul className="space-y-3 font-medium text-sm">
              <li><Link to="/" className="text-slate-500 hover:text-blue-400 transition-colors">Home Feed</Link></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">Universities</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">Departments</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">Events & Webinars</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5 text-sm tracking-wide">Support</h4>
            <ul className="space-y-3 font-medium text-sm">
              <li><a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">Community Guidelines</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm tracking-wide">Get in Touch</h4>
            <ul className="space-y-4 font-medium text-sm">
              <li className="flex items-start">
                <Mail className="w-4 h-4 mr-3 text-blue-400 mt-0.5" />
                <span className="text-slate-500">
                  contact@arsiasekonet.edu<br />
                  <span className="text-slate-600 text-[11px]">Replies within 24 hours</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between text-sm font-medium">
          <p className="text-slate-600 mb-4 md:mb-0 text-[13px]">
            &copy; {new Date().getFullYear()} Arsi Aseko Network. All rights reserved.
          </p>
          <div className="flex items-center text-slate-600 text-[13px]">
            Made with <Heart className="w-3.5 h-3.5 mx-1.5 text-rose-500 fill-rose-500" /> by students, for students.
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
