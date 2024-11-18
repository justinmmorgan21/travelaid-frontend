import { MdCopyright } from "react-icons/md";
export function Footer() {
  return (
    <footer className="bg-gray-600 text-white p-4 fixed bottom-0 w-full">
      <div className="flex flex-row font-bold justify-center">
      <MdCopyright className="mt-1 mr-2"/>
      <span >2024</span>
      </div>
    </footer>
  )
}