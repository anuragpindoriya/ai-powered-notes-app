import {Avatar, AvatarFallback} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import {LogOut} from "lucide-react"
import React from "react";

export default function Header({children}: { children: React.ReactNode }) {
    return (<>
            <header
                className="sticky top-0 z-50 flex items-center justify-between p-4 border-b shadow-sm backdrop-blur border-gray-200 px-6 py-4  bg-white/70">
                <h1 className="text-2xl font-bold tracking-tight text-blue-700">✨ AI Notes</h1>
                <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarFallback>N</AvatarFallback>
                    </Avatar>
                    <Button variant="ghost" size="icon">
                        <LogOut className="w-5 h-5"/>
                    </Button>
                </div>
            </header>

            {children}

        </>
    )
}
