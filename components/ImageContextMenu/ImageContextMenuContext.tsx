'use client'
import { createContext, useCallback, useContext, useState } from "react";
import { ImageContextMenu } from "./ImageContextMenu";

type ImageContextMenuConfig = {
	id: string;
	x: number;
	y: number;
	scale: number;
	onNewScale: (scale: number) => void;
	onDelete: () => void;
	onClose?: () => void;
};

type ImageContextMenuContextType = {
	showImageContextMenu: (config: Omit<ImageContextMenuConfig, "id">) => void;
	closeImageContextMenu: (id: string) => void;
	close: () => void;
};

const ImageContextMenuContext = createContext<ImageContextMenuContextType | null>(null);

export const useImageContextMenu = () => {
	const ctx = useContext(ImageContextMenuContext);
	if (!ctx) throw new Error("ImageContextMenuProvider is missing");
	return ctx;
};

function generateUUIDv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = Math.random() * 16 | 0;
		const v = c === 'x' ? r : (r & 0x3 | 0x8); // y is 8, 9, A, or B
		return v.toString(16);
	});
}


export const ImageContextMenuProvider = ({ children }: { children: React.ReactNode }) => {
  	const [icm, setIcm] = useState<ImageContextMenuConfig[]>([]);

	const showImageContextMenu = useCallback((config: Omit<ImageContextMenuConfig, "id">) => {
		const id = generateUUIDv4();
		setIcm((prev) => [{ ...config, id }]);
	}, []);

	const close = useCallback(() => {
		setIcm((prev) => {
			if (prev.length === 0) return prev;
			const lastModal = prev[prev.length - 1];
			if (lastModal.onClose) lastModal.onClose();
			return prev.slice(0, -1);
		});
  }, []);

	const closeImageContextMenu = useCallback((id: string) => {
		setIcm((prev) => prev.filter((m) => m.id !== id));
	}, []);

	return (
		<ImageContextMenuContext.Provider value={{ showImageContextMenu, closeImageContextMenu, close }}>
			{children}
			{icm.map((icmItem, index) => {
				return <ImageContextMenu 
					key={index}
					x={icmItem.x}
					y={icmItem.y}
					scale={icmItem.scale}
					onNewScale={icmItem.onNewScale}
					onDelete={icmItem.onDelete}
					closeAction={() => closeImageContextMenu(icmItem.id)}
				/>
			})}
		</ImageContextMenuContext.Provider>
	);
};
