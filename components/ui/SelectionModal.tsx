'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Button } from './button';
import { ScrollArea } from './scroll-area';

interface SelectionModalProps {
  isVisible: boolean;
  data: string[];
  onSelect: (value: string) => void;
  onClose: () => void;
  title: string;
  selectedValue?: string;
}

export default function SelectionModal({
  isVisible,
  data,
  onSelect,
  onClose,
  title,
  selectedValue,
}: SelectionModalProps) {
  if (!isVisible) return null;

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[200px]">
          <div className="grid gap-4 py-4">
            {data.map((item) => (
              <Button
                key={item}
                variant={selectedValue === item ? 'default' : 'ghost'}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="w-full justify-start"
              >
                {item}
              </Button>
            ))}
          </div>
        </ScrollArea>
        <Button onClick={onClose} variant="outline">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
