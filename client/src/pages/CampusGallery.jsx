import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Map, Building, Sparkles } from 'lucide-react';

const CampusGallery = () => {
  // Using high-quality unsplash placeholders since generation failed
  const images = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?auto=format&fit=crop&q=80&w=1200",
      title: "Main Campus Overview",
      category: "Campus"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200",
      title: "Student Collaboration Hub",
      category: "Student Life"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
      title: "Central Library",
      category: "Facilities"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800",
      title: "Graduation Square",
      category: "Campus"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200",
      title: "Research Laboratories",
      category: "Facilities"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
      title: "Innovation Center",
      category: "Student Life"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24">
      <Helmet>
        <title>Campus Gallery | Arsi Aseko University</title>
        <meta name="description" content="Explore the beautiful campus, modern facilities, and vibrant student life at Arsi Aseko University through our photo gallery." />
      </Helmet>

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto mb-16 pt-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-6">
          <ImageIcon className="w-3.5 h-3.5" /> Visual Tour
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">
          Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Arsi Aseko</span>
        </h1>
        <p className="text-slate-400 text-lg font-medium leading-relaxed">
          Take a visual journey through our state-of-the-art facilities, lush green campus grounds, and the dynamic life of our student community.
        </p>
      </motion.div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group relative rounded-[2rem] overflow-hidden aspect-[4/3] border border-white/[0.05]"
          >
            <div className="absolute inset-0 bg-slate-900/20 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
            <img 
              src={image.src} 
              alt={image.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 bg-gradient-to-t from-[#060a14]/90 via-[#060a14]/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block px-2 py-1 bg-blue-500/20 backdrop-blur-md rounded border border-blue-500/30 text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-2">
                  {image.category}
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">{image.title}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CampusGallery;
