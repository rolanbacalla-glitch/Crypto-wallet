import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionItemProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onClick?: () => void;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ title, icon, children, isOpen, onClick }) => {
  return (
    <div className={`flex flex-col overflow-hidden transition-all duration-500 ${isOpen ? 'flex-grow' : 'flex-none'}`}>
      <button
        onClick={onClick}
        className={`w-full py-6 flex items-center justify-between group focus:outline-none transition-colors ${isOpen ? 'text-primary' : 'text-text-muted hover:text-white'}`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${isOpen ? 'bg-primary/10 border-primary/30' : 'bg-white/5 border-white/10 group-hover:border-white/20'}`}>
            <span className="material-symbols-outlined text-sm">{icon}</span>
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">{title}</span>
        </div>
        <motion.span 
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="material-symbols-outlined text-xl opacity-30"
        >
          expand_more
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="pb-8 pt-2 overflow-hidden">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="h-[1px] w-full bg-white/5" />
    </div>
  );
};

interface VerticalAccordionProps {
  children: React.ReactElement<AccordionItemProps>[];
}

export const VerticalAccordion: React.FC<VerticalAccordionProps> = ({ children }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col w-full">
      {React.Children.map(children, (child, index) => {
        return React.cloneElement(child, {
          isOpen: openIndex === index,
          onClick: () => setOpenIndex(openIndex === index ? null : index),
        });
      })}
    </div>
  );
};
