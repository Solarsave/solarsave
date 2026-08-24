import { getGHI } from "@/lib/get-ghi"

export const Button = () => {
    
    const clickButton = async () => {
        const buttonData = await getGHI();
        console.log("buttonData", buttonData)
    }
  
    return (
    <button onClick={clickButton} className="bg-green-200 text-red-500 px-5 py-2 absolute left-100 top-20 z-20 w-75">
        TEST API
    </button>
  )
}
