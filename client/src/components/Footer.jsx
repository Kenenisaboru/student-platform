import { Link } from 'react-router-dom';
import { Heart, Github, Twitter, Linkedin, Mail, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 relative overflow-hidden mt-20">
      {/* Decorative background blur */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl mix-blend-overlay"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl mix-blend-overlay"></div>

      <div className="container mx-auto px-4 py-16 max-w-6xl relative z-10">
        
        {/* Motivational Banner */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 rounded-3xl p-8 mb-16 border border-slate-700/50 flex flex-col items-center text-center shadow-2xl">
          <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-primary-400" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Your future starts here.</h3>
          <p className="text-slate-400 max-w-2xl text-lg mb-0 font-medium leading-relaxed">
            "The beautiful thing about learning is that no one can take it away from you." <br /> 
            Connect, grow, and build your legacy with the Arsi Aseko Network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <div className="w-8 h-8 bg-gradient-to-tr from-primary-500 to-indigo-500 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
                <span className="font-extrabold text-sm">AA</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold text-white leading-none tracking-tight">Arsi Aseko</span>
                <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mt-0.5">Network</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 font-medium">
              A premium, unified platform designed to connect students from across Arsi Aseko universities. Share ideas, collaborate, and evolve.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all text-slate-400">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all text-slate-400">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all text-slate-400">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Resources</h4>
            <ul className="space-y-3 font-medium text-sm">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home Feed</Link></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Universities</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Departments</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Events & Webinars</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Support</h4>
            <ul className="space-y-3 font-medium text-sm">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Community Guidelines</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Get in Touch</h4>
            <ul className="space-y-4 font-medium text-sm">
              <li className="flex items-start">
                <Mail className="w-5 h-5 mr-3 text-primary-400 mt-0.5" />
                <span>
                  contact@arsiasekonet.edu<br />
                  <span className="text-slate-500 text-xs">Replies within 24 hours</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-sm font-medium">
          <p className="text-slate-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Arsi Aseko Network. All rights reserved.
          </p>
          <div className="flex items-center text-slate-500">
            Made with <Heart className="w-4 h-4 mx-1.5 text-rose-500 fill-rose-500" /> by students, for students.
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
