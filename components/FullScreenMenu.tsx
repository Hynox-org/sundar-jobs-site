'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { ThemedText } from './themed-text';
import { Home, BriefcaseBusiness, PlusCircle, Info, LogIn, User } from 'lucide-react'; // Example icons

interface FullScreenMenuProps {
  isVisible: boolean;
  onClose: () => void;
  onMenuItemPress: (screen: string) => void;
}

export default function FullScreenMenu({
  isVisible,
  onClose,
  onMenuItemPress,
}: FullScreenMenuProps) {

  const menuItems = [
    { name: 'Home', icon: Home, screen: '/' },
    { name: 'All Jobs', icon: BriefcaseBusiness, screen: '/alljobs' }, // Using /alljobs as the path
    { name: 'Post a Job', icon: PlusCircle, screen: '/postjobs' }, // Using /postjobs as the path
    { name: 'About', icon: Info, screen: '/about' },
    { name: 'Login / Profile', icon: User, screen: '/login' }, // Placeholder, can be /profile if logged in
  ];

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] h-full flex flex-col">
        <DialogHeader>
          <DialogTitle>Menu</DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex flex-col gap-4 py-4">
          {menuItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              onClick={() => onMenuItemPress(item.screen)}
              className="w-full justify-start text-lg h-12"
            >
              <item.icon className="mr-4 h-6 w-6" />
              <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
            </Button>
          ))}
        </div>
        <Button onClick={onClose} variant="outline" className="mt-4">
          Close Menu
        </Button>
      </DialogContent>
    </Dialog>
  );
}
