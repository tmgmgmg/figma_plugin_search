"use client";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Category, Tag } from "@/lib/kuroco";

interface MobileMenuProps {
  categories: Category[];
  tags: Tag[];
}

export function MobileMenu({ categories, tags }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="p-0 lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SheetTitle>Menu</SheetTitle>
        <Sidebar categories={categories} tags={tags} />
      </SheetContent>
    </Sheet>
  );
}
