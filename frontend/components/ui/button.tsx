"use client"
import { GeocodedPlace } from "@/lib/geocoding";
import { getGHI } from "@/lib/get-ghi"

export const Button = ({ place }: { place: GeocodedPlace }) => {
    
    const clickButton = async () => {
        const buttonData = await getGHI(place);
        console.log("buttonData", buttonData)
    }
  
    return (
    <button onClick={clickButton} className="bg-slate-200 w-full p-2 hover:bg-slate-300 rounded-sm font-semibold text-blue-900 ">
        check cost
    </button>
  )
}
