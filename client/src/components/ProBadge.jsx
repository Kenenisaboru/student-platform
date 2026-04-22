import React from 'react';
import { Sparkles } from 'lucide-react';

const ProBadge = ({ className = "" }) => {
  return (
    <div className={`pro-badge inline-flex items-center gap-1 ${className}`}>
      <Sparkles className="w-2 h-2" />
      <span>PRO</span>
    </div>
  );
};

export default ProBadge;
