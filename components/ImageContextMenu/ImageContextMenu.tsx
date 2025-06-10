'use client'
import './ImageContextMenu.css'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ScaleRange from '../ScaleRange/ScaleRange';

type ImageContextMenuProps = {
	x: number;
	y: number;
	scale: number;
	onNewScale: (scale: number) => void;
	onDelete: () => void;
   closeAction: Function;
};

export function ImageContextMenu ({ x, y, scale, closeAction, onNewScale, onDelete }: ImageContextMenuProps) {
   const [scaleNew, setScaleNew] = useState(scale);
   const imgCmRef = useRef<any | null>(null);

   useEffect(() => {
      function handleClickOutside(event: any) {
         if (imgCmRef.current && !imgCmRef.current.contains(event.target)) {
            closeAction();
         }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [imgCmRef]);


   const handleScaleChange = (change: number) => {
      if (scaleNew < 0.11 && change < 0) return;
      setScaleNew((prev) => parseFloat((prev + change).toFixed(2)))
      onNewScale(parseFloat((scaleNew + change).toFixed(2)))
   }

   const handleScaleRange = (newScale: number) => {
      setScaleNew(newScale)
      setScaleNew((prev) => parseFloat(newScale.toFixed(2)))
      onNewScale(parseFloat(newScale.toFixed(2)))
   }

   return (
      <div className="image-context-menu" ref={imgCmRef} style={{
         top:`${y}px`,
         left:`${x}px`,
         position: 'absolute'
      }}>
         <div className="text-s dfb align-center">
            <button className="s transparent fit" onClick={() => handleScaleChange(-0.02)}>
               <Minus size={17} color='#fff' />
            </button>
            <div className="text-xxxs dfb align-center justify-center text-center pdx-15 grey-2">
               <ScaleRange value={scaleNew} onChange={(newS: any) => handleScaleRange(newS)}  />
            </div>
            <button className="s transparent fit" onClick={() => handleScaleChange(0.02)}>
               <Plus size={17} color='#fff' />
            </button>
         </div>
         <div className="text-s dfb align-center justify-center mt-05" onClick={() => {
            onDelete();
            closeAction();   
         }}>
            <button className="xxxs delete-item full"><Trash2 size={15} /> Delete</button>
         </div>
      </div>
   )
}
