import Link from "next/link"
import { Mountain } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="border-b border-slate-700 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between h-14">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <Mountain className="w-5 h-5 text-blue-400" />
          <span className="text-white">Trail Palantir</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">
            대시보드
          </Link>
          <Link href="/alerts" className="text-slate-300 hover:text-white transition-colors">
            경보
          </Link>
        </div>
      </div>
    </nav>
  )
}
