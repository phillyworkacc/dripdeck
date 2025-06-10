'use client'
import './ScaleRange.css'
import { useRef } from 'react';

type ScaleRangeProps = {
   value: number;
   onChange: Function;
}

export default function ScaleRange ({ value, onChange }: ScaleRangeProps) {
   const min = 0.1;
   const max = 1;
   const trackRef = useRef<any | null>(null);

   const onPointerMove = (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const percent = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      const newValue = min + percent * (max - min);
      onChange(parseFloat(newValue.toFixed(2)));
   };

   const handleMouseDown = (e: any) => {
      e.preventDefault();
      const onMouseMove = (eMove: any) => onPointerMove(eMove.clientX);
      const onMouseUp = () => {
         document.removeEventListener('mousemove', onMouseMove);
         document.removeEventListener('mouseup', onMouseUp);
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
   };

   const handleTouchStart = (e: any) => {
      e.preventDefault();
      const onTouchMove = (eMove: any) => {
         if (eMove.touches.length > 0) {
            onPointerMove(eMove.touches[0].clientX);
         }
      };
      const onTouchEnd = () => {
         document.removeEventListener('touchmove', onTouchMove);
         document.removeEventListener('touchend', onTouchEnd);
         document.removeEventListener('touchcancel', onTouchEnd);
      };
      document.addEventListener('touchmove', onTouchMove);
      document.addEventListener('touchend', onTouchEnd);
      document.addEventListener('touchcancel', onTouchEnd);
   };

   const percent = ((value - min) / (max - min)) * 100;

   return (
      <div className='scale-range-container'>
         <div ref={trackRef} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} className='scale-range'>
            <div className='range' style={{ width: `${percent}%` }} />
            <div className='thumb' style={{ left: `${percent}%` }} />
         </div>
         <div className='label'>Size: {Math.round(value*100)}%</div>
      </div>
   );
}
