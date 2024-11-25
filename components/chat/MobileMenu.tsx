"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useSheetStore } from "@/store/sheet";

export function MobileMenu({ children }: { children: React.ReactNode }) {
    const { open, setOpen } = useSheetStore((state) => ({
        open: state.open,
        setOpen: state.setOpen,
    }));
    return (
        <div className="md:hidden">
            <Sheet open={open} onOpenChange={(open) => setOpen(open)}>
                <SheetTrigger asChild>
                    <Menu />
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                    <VisuallyHidden.Root>
                        <SheetTitle>Menu</SheetTitle>
                    </VisuallyHidden.Root>
                    {children}
                </SheetContent>
            </Sheet>
        </div>
    );
}
