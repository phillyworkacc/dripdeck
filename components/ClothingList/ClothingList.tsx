'use client'
import './ClothingList.css'
import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronRight, X } from 'lucide-react';
import { CustomProductIcon } from '../Icons/Icon';
import { AnimatePresence, motion } from 'framer-motion';
import { imageScale } from '@/app/page';

type ClothingListProps = {
	x: number;
	y: number;
	onAddNewClothingItem: (item: CanvasItem) => void;
   onCloseAction: Function;
};

const clothingListJSONString = `{
   "accessories": [
      "airpod_max.png",
      "airpods.png",
      "cross_chain.png",
      "silver_chain.png"
   ],
   "tops": [
      "black_tshirt.png",
      "future_projects_green_hoodie.png",
      "grey_hoodie.png",
      "navy_tshirt.png",
      "white_tshirt.png",
      "adidas_allszn_sweatshirt.png",
      "black_zip_up_hoodie.png",
      "boohooman_light_blue_hoodie.png"
   ],
   "bottoms": [
      "baggy_black_jeans.png",
      "black_cargos_pants.png"
   ],
   "shoes": [
      "airforce1.png",
      "black_addidas_campus.png",
      "blue_addidas_campus.png",
      "green_addidas_campus.png",
      "grey_addidas_campus.png",
      "red_addidas_campus.png",
      "uggs.png"
   ],
   "headwear": [
      "blue_la_cap.png",
      "red_la_cap.png"
   ],
   "phones": [
      "iphone_13_blue.png",
      "iphone_13_pink.png",
      "iphone_16_black.png",
      "iphone_16_blue.png",
      "iphone_16_pink.png",
      "iphone_16_pro_blue.png",
      "iphone_16_pro_lightblue.png",
      "s25_black.png",
      "s25_sky_blue.png"
   ],
   "perfumes": [
      "bleu_de_chanel.png",
      "byredo_bal_d'afrique.png",
      "byredo_gypsy_water.png",
      "creed_aventus.png",
      "dior_ambre_nuit.png",
      "dior_oud_ispahan.png",
      "initio_oud_for_greatness.png",
      "mfk_baccarat_rouge.png",
      "mfk_silk_mood.png",
      "penhaligon_halfeti_leather.png",
      "tiziana_terenzi_kirke.png",
      "tom_ford_neroli_portofino.png",
      "tom_ford_oud_wood.png",
      "xerjoff_coro.png",
      "xerjoff_erba_pura.png",
      "xerjoff_opera.png",
      "xerjoff_soprano.png"
   ]
}`


export function ClothingList ({ x, y, onCloseAction, onAddNewClothingItem }: ClothingListProps) {
   const [categorySelected, setCategorySelected] = useState<string | null>(null);
   const [savedOutfits, setSavedOutfits] = useState<any[]>([]);
   const imageKitUrl = 'https://ik.imagekit.io/ioyj2mdnudripdeckapp/'

   useEffect(() => {
      setSavedOutfits(JSON.parse(localStorage.getItem('drip_deck_saved_outfits')!))
      console.log(JSON.parse(localStorage.getItem('drip_deck_saved_outfits')!))
   }, [])

   const titleCase = (text: string) => {
      return `${text[0].toUpperCase()}${text.substring(1).toLowerCase()}`;
   }

   const itemToTextCase = (itemSrc: string) => {
      const words = itemSrc.split('.')[0].split('_');
      return words.map(word => titleCase(word)).join(' ');
   }

   function generateRandomCode (length: number = 6): string {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
         const randomIndex = Math.floor(Math.random() * chars.length);
         result += chars[randomIndex];
      }
      return result;
   }

   return (
      <div className='modal'>
         <AnimatePresence>
            <motion.div 
               className='modal-box'
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.8, opacity: 0 }}
               transition={{ duration: 0.2 }}
            >
               <div className="close">
                  <button className='close-btn' onClick={() => onCloseAction()}><X color='#000' size={20} /></button>
               </div>
               <div className="modal-content">
                  {(categorySelected == null) ? <>
                     <div className="text-xs bold-700 pd-1">All Clothing</div>
                     {Object.entries(JSON.parse(clothingListJSONString)).map(([category, items]: any[], index) => (
                        <div key={index} className="option" onClick={() => setCategorySelected(category)}>
                           <CustomProductIcon size={50} url={`${imageKitUrl}${JSON.parse(clothingListJSONString)[category][0]}`} />
                           <div className="text-xxs fit">{titleCase(category)}</div>
                           <ChevronRight size={14} />
                        </div>
                     ))}
                     <div className="option" onClick={() => setCategorySelected('saved')}>
                        <CustomProductIcon size={50} url={`/logo.png`} />
                        <div className="text-xxs fit">Saved Outfits</div>
                        <ChevronRight size={14} />
                     </div>

                  </> : <>
                     <div className="text-xxxs grey-5 pd-05 mb-1 cursor-pointer dfb align-center gap-4" onClick={() => setCategorySelected(null)}>
                        <ArrowLeft size={17} /> All Clothing
                     </div>
                     {(categorySelected == "saved") ? (<>
                        <div className="text-xs bold-700 mb-1">Saved Outfits</div>
                        {savedOutfits.map((outfit: any, index: any) => {
                           return <div key={index} className="option" onClick={() => {
                              for (let i = 0; i < outfit.items.length; i++) {
                                 const item = outfit.items[i];
                                 onAddNewClothingItem({
                                    id: `${categorySelected}${generateRandomCode(10)}`,
                                    x: item.x, y: item.y, imageSrc: item.imageSrc,
                                    scale: item.scale
                                 });
                              }
                              onCloseAction();
                           }}>
                              <CustomProductIcon size={50} url={`${outfit.items[0].imageSrc}`} />
                              <div className="text-xxs">{outfit.outfitName}</div>
                           </div>
                        })}
                     
                     </>) : (<>
                        <div className="text-xs bold-700 mb-1">{titleCase(categorySelected)}</div>
                        {JSON.parse(clothingListJSONString)[categorySelected].map((item: any, index: number) => (
                           <div key={index} className="option" onClick={() => {
                              onAddNewClothingItem({
                                 id: `${categorySelected}${generateRandomCode(10)}`,
                                 x, y, imageSrc: `${imageKitUrl}${item}`,
                                 scale: imageScale
                              });
                              onCloseAction();
                           }}>
                              <CustomProductIcon size={50} url={`${imageKitUrl}${item}`} />
                              <div className="text-xxs">{itemToTextCase(item)}</div>
                           </div>
                        ))}

                     </>)}
                  </>}
               </div>
            </motion.div>
         </AnimatePresence>
      </div>
   )
}
