'use client'
import { createContext, useCallback, useContext, useState } from "react";
import { ClothingList } from "./ClothingList";

type ClothingListConfig = {
	id: string;
	x: number;
	y: number;
	onAddNewClothingItem: (item: CanvasItem) => void;
	onClose?: () => void;
};

type ClothingListContextType = {
	showClothingList: (config: Omit<ClothingListConfig, "id">) => void;
	closeClothingList: (id: string) => void;
	close: () => void;
};

const ClothingListContext = createContext<ClothingListContextType | null>(null);

export const useClothingList = () => {
	const ctx = useContext(ClothingListContext);
	if (!ctx) throw new Error("ClothingListProvider is missing");
	return ctx;
};

function generateUUIDv4() {
	// UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = Math.random() * 16 | 0;
		const v = c === 'x' ? r : (r & 0x3 | 0x8); // y is 8, 9, A, or B
		return v.toString(16);
	});
}


export const ClothingListProvider = ({ children }: { children: React.ReactNode }) => {
  	const [cList, setCList] = useState<ClothingListConfig[]>([]);

	const showClothingList = useCallback((config: Omit<ClothingListConfig, "id">) => {
		const id = generateUUIDv4();
		setCList((prev) => [{ ...config, id }]);
	}, []);

	const close = useCallback(() => {
		setCList((prev) => {
			if (prev.length === 0) return prev;
			const lastClothingList = prev[prev.length - 1];
			if (lastClothingList.onClose) lastClothingList.onClose();
			return prev.slice(0, -1);
		});
  }, []);

	const closeClothingList = useCallback((id: string) => {
		setCList((prev) => prev.filter((m) => m.id !== id));
	}, []);

	return (
		<ClothingListContext.Provider value={{ showClothingList, closeClothingList, close }}>
			{children}
			{cList.map((clothingList, index) => {
				return <ClothingList 
					key={index}	x={clothingList.x} y={clothingList.y}
					onAddNewClothingItem={clothingList.onAddNewClothingItem}
					onCloseAction={() => {
						if (clothingList.onClose) clothingList.onClose();
						closeClothingList(clothingList.id);
					}}
				/>
			})}
		</ClothingListContext.Provider>
	);
};
