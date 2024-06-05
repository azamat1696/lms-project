"use client";

import {Category} from "@prisma/client";
import {
     FcEngineering,
     FcFilmReel,
    FcMultipleDevices,
    FcMusic,
    FcOldTimeCamera,
    FcSalesPerformance,
    FcSportsMode,
} from "react-icons/fc";
import {IconType} from "react-icons";
import {CategoryItem} from "@/app/(dashboard)/(routes)/search/_components/category-item";

interface Props {
    items: Category[];
}
const iconMap: Record<Category["name"],IconType> = {
    "Development": FcEngineering,
    "Music": FcMusic,
    "Photography": FcOldTimeCamera,
    "Film": FcFilmReel,
    "Business": FcSalesPerformance,
    "Design": FcMultipleDevices,
    "Sports": FcSportsMode,
};
export function Categories({items}: Props) {
  return (
      <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
          {items.map((item) => (
              <CategoryItem
                  key={item.id}
                  label={item.name}
                  icon={iconMap[item.name]}
                  value={item.id}
              />
          ))}
      </div>
  );
}
