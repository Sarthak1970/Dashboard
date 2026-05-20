// components/Navbar.tsx
"use client";

import ThemeToggle from "./modetoggle";
import { Moon, Sun, Users, Table } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="border-b bg-card/95 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Table className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">FrontEnd Task</h1>
              <p className="text-xs text-muted-foreground -mt-1">Student Portal</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Dashboard</a>
            {/* <a href="#" className="text-foreground font-semibold">Students</a>
            <a href="#" className="hover:text-foreground transition-colors">Courses</a>
            <a href="#" className="hover:text-foreground transition-colors">Reports</a> */}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5 text-sm">
              <Users className="w-4 h-4" />
              <span className="font-medium">500 Students</span>
            </div>


            <ThemeToggle></ThemeToggle>
            {/* 
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer">
              AS
            </div> */}
          </div>
        </div>
      </div>
    </nav>
  );
}