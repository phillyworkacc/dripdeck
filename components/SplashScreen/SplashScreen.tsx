'use client'
import './SplashScreen.css'
import { AnimatePresence, motion } from 'framer-motion'
import { DripDeckSvgLogo } from '../Icons/Icon'
import { useEffect, useState } from 'react'

export default function SplashScreen() {
   const [showSplash, setShowSplash] = useState(true)

	useEffect(() => {
      const timer = setTimeout(() => setShowSplash(false), 1000);
      return () => clearTimeout(timer);
	}, [])

   return (
      <AnimatePresence>
         {showSplash && <motion.div 
            className='splash-screen'
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
         >
            <motion.div
               className='splash-icon'
               initial={{ scale: 1, opacity: 1 }}
               animate={{
                  scale: [null, 1.8, 0],
                  opacity: [1, 1, 0.4],
                  transition: {
                     duration: 1,
                     times: [0, 0.7, 1],
                     ease: ["easeInOut", "easeOut"],
                  },
               }}
               transition={{
                  duration: 1,
                  ease: "easeOut",
               }}
            ><DripDeckSvgLogo size={100} /></motion.div>
         </motion.div>}
      </AnimatePresence>
   )
}
