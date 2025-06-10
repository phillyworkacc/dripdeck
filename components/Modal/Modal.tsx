'use client'
import './Modal.css'
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ReactNode } from 'react'

type ModalProps = {
   children: ReactNode;
   onCloseAction: Function;
}

export function Modal ({ children, onCloseAction }: ModalProps) {
   return (
      <div className="image-preview">
         <AnimatePresence>
            <motion.div 
               className='image-preview-box'
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.8, opacity: 0 }}
               transition={{ duration: 0.2 }}
            >
               <div className="close">
                  <button className='close-btn' onClick={() => onCloseAction()}><X color='#000' /></button>
               </div>
               <div className="image-preview-content">
                  {children}
               </div>
            </motion.div>
         </AnimatePresence>
      </div>
   )
}
