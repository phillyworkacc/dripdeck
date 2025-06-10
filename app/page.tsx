'use client'
import "@/styles/app.css"
import SplashScreen from "@/components/SplashScreen/SplashScreen"
import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react"
import { useClothingList } from "@/components/ClothingList/ClothingListContext";
import { Stage, Layer, Image } from 'react-konva';
import { useImageContextMenu } from "@/components/ImageContextMenu/ImageContextMenuContext";
import { CircleArrowDown, CirclePlus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export default function AppPage () {
	const captureRef = useRef<any | null>(null);

	const { showClothingList } = useClothingList();
	const { showImageContextMenu } = useImageContextMenu();

	const [items, setItems] = useState<CanvasItem[]>([]);
   const [images, setImages] = useState<{ [key: string]: HTMLImageElement }>({});
	const [windowWidth, setWindowWidth] = useState(0);
	const [windowHeight, setWindowHeight] = useState(0);
	const [outfitName, setOutfitName] = useState('');
	const [showSaveOutfitDialog, setShowSaveOutfitDialog] = useState(false)

   // load images only once per src
   useEffect(() => {
      items.forEach(({ imageSrc }) => {
         if (!images[imageSrc]) {
            const img = new window.Image();
            img.src = imageSrc;
            img.onload = () => {
               setImages((prev) => ({ ...prev, [imageSrc]: img }));
            };
         }
      });
      console.log(window.innerHeight, window.innerWidth)
   }, [items, images]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.code === 'Enter') {
				showClothingListModal(100, 100);
				e.preventDefault();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	useEffect(() => {
		setWindowWidth(window.innerWidth);
		setWindowHeight(window.innerHeight);
	}, []);

   // handle drag end to update position
   const onDragEnd = (id: string, e: any) => {
      const { x, y } = e.target.position();
      setItems((prev) =>
         prev.map((item) => (item.id === id ? { ...item, x, y } : item))
      );
   };

	const showClothingListModal = (x: number, y: number) => {
		showClothingList({
			x, y, onAddNewClothingItem: (item) => setItems((prev) => [...prev, item])
		})
	}

	const saveOutfitToLocalStorage = () => {
		// get outfit name or user opts out of saving the outfit
		setShowSaveOutfitDialog(false);

		try {
			// Save items positions
			const itemsToSave = items.map(item => ({
				id: item.id,
				x: item.x,
				y: item.y,
				imageSrc: item.imageSrc,
				scale: item.scale
			}));
	
			// Load existing outfits array (or empty array)
			const existing = localStorage.getItem('drip_deck_saved_outfits');
			const outfits = existing ? JSON.parse(existing) : [];
	
			// Add new outfit (optional: add timestamp or name)
			const newOutfit = {
				id: Date.now(),
				outfitName: outfitName,
				items: itemsToSave
			};
	
			outfits.push(newOutfit);
	
			// Save back to localStorage
			localStorage.setItem('drip_deck_saved_outfits', JSON.stringify(outfits));
		} catch (e) {}
	}

	const createImage = async () => {
		if (!captureRef.current) return;
		const canvas = await html2canvas(captureRef.current, { scale: 2 });
		return canvas.toDataURL();
	}

	const saveImage = async () => {
		if (items.length < 1) {
			toast.error("Add some clothing");
			return;
		}

		setOutfitName('');
		setShowSaveOutfitDialog(true);

		const imgUrl = await createImage();
		if (!imgUrl) return;
		
      toast('Saving...');
		
		const link = document.createElement('a');
		link.download = `outfit.png`;
		link.href = imgUrl;
		link.click();

      toast.success('Saved Outfit');
	};

	const getContextMenuPosition = (clickX: number, clickY: number) => {
		const menuWidth = 200;
		const menuHeight = 120;
		let x = clickX;
		let y = clickY;

		if (x + menuWidth > window.innerWidth) {
			x = window.innerWidth - menuWidth - 5;
		}

		if (y + menuHeight > window.innerHeight) {
			y = window.innerHeight - menuHeight - 5;
		}

		if (x < 10) x = 10;
		if (y < 10) y = 10;

		return { x, y };
	};

	return (
		<div className="app-container" onContextMenu={(e) => e.preventDefault()} onDoubleClick={(e) => showClothingListModal(e.clientX, e.clientY)}>
		
			<SplashScreen />

			{showSaveOutfitDialog && (<div className="image-preview">
				<div className="image-preview-box">
               <div className="close">
                  <button className='close-btn' onClick={() => setShowSaveOutfitDialog(false)}><X color='#000' /></button>
               </div>
               <div className="image-preview-content">
						<div className="text-l bold-700 pd-1">Save Outfit</div>
						<div className="text-s pd-1">
							<input type="text" className="xs full" placeholder="Outfit Name" value={outfitName} onChange={(e) => setOutfitName(e.target.value)} />
						</div>
						<div className="text-s dfb align-center justify-center gap-7 pd-1">
							<button className="xxs full pd-1" onClick={() => {
								if (outfitName == "") { toast.error("Please enter a name for the outfit"); return; };
								saveOutfitToLocalStorage();
							}}>Save</button>
							<button className="xxs full pd-1 outline-black" onClick={() => setShowSaveOutfitDialog(false)}>Cancel</button>
						</div>
               </div>
				</div>
			</div>)}
		
			<div className="add-item">
				<button className="transparent" onClick={() => showClothingListModal(100, 100)}>
					<CirclePlus size={25} color="#fff" />
				</button>
				<button className="transparent" onClick={() => setItems([])}>
					<Trash2 size={25} color="#fff" />
				</button>
			</div>
		
			<div className="save-item">
				<button className="transparent" onClick={saveImage}>
					<CircleArrowDown size={25} color="#fff" />
				</button>
			</div>
		
			<div ref={captureRef} className="container">
				<Stage className="outfit-design" width={windowWidth} height={windowHeight} scaleX={0.8} scaleY={0.8}>
					<Layer>
						{items.map(({ id, x, y, imageSrc, scale }, index) => {
							let longPressTimer: any = null;
							return images[imageSrc] && (
								<Image
									key={id} image={images[imageSrc]}
									x={x} y={y} draggable scaleX={scale} scaleY={scale}
									onDragEnd={(e) => onDragEnd(id, e)}
									onContextMenu={(e: any) => {
										e.evt.preventDefault();
										showImageContextMenu({
											x: getContextMenuPosition(e.evt.clientX, e.evt.clientY).x,
											y: getContextMenuPosition(e.evt.clientX, e.evt.clientY).y,
											scale: scale,
											onNewScale: (newScale) => {
												setItems((prev) => [...prev.map((item, ind) => {
													if (index == ind) return { ...item, scale: newScale };
													return { ...item };
												})])
											},
											onDelete: () => {
												setItems((prev) => [...prev.filter((itm, ind) => index !== ind)])
											}
										});
									}}
									onTouchStart={(e) => {
										longPressTimer = setTimeout(() => {
											const touch = e.evt.touches[0];
											showImageContextMenu({
												x: touch.clientX,
												y: touch.clientY,
												scale: scale,
												onNewScale: (newScale) => {
													setItems((prev) => [...prev.map((item, ind) => {
														if (index == ind) return { ...item, scale: newScale };
														return { ...item };
													})])
												},
												onDelete: () => {
													setItems((prev) => [...prev.filter((itm, ind) => index !== ind)])
												}
											});
										}, 500);
									}}
									onTouchEnd={() => {
										clearTimeout(longPressTimer);
									}}
									onTouchMove={() => {
										clearTimeout(longPressTimer);
									}}
								/>)
						})}
					</Layer>
				</Stage>
			</div>
		
		</div>
	)
}
