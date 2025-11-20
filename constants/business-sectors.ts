// For web, SVG components might be handled differently than in React Native.
// For simplicity, we'll use string names for icons or a mapping to actual web-compatible icons (e.g., Lucide React).
// For now, `icon` will just be a string.

export interface BusinessSector {
  id: string;
  name: string;
  name_ta: string; // Tamil name property
  icon: string; // Placeholder for icon name or path (e.g., from Lucide React)
}

export const BUSINESS_SECTORS: BusinessSector[] = [
  { id: '1', name: 'Computer & Mobile', name_ta: 'கணினி மற்றும் மொபைல்', icon: 'Laptop' },
  { id: '2', name: 'Beauty & Salon', name_ta: 'அழகு மற்றும் சலூன்', icon: 'Scissors' },
  { id: '3', name: 'Banking', name_ta: 'வங்கி', icon: 'Banknote' },
  { id: '4', name: 'Teaching', name_ta: 'கற்பித்தல்', icon: 'BookOpen' },
  { id: '5', name: 'Supermarket & Retail', name_ta: 'சூப்பர் மார்க்கெட் மற்றும் சில்லறை விற்பனை', icon: 'ShoppingCart' },
  { id: '6', name: 'Laundry & Ironing', name_ta: 'சலவை மற்றும் சலவை செய்தல்', icon: 'Shirt' },
  { id: '7', name: 'Factory & Production', name_ta: 'தொழிற்சாலை மற்றும் உற்பத்தி', icon: 'Factory' },
  { id: '8', name: 'Repair & Fixing', name_ta: 'பழுதுபார்த்தல்', icon: 'Wrench' },
  { id: '9', name: 'Cleaning & Housekeeping', name_ta: 'சுத்தம் மற்றும் வீட்டு பராமரிப்பு', icon: 'Brush' },
  { id: '10', name: 'Security & Watchman', name_ta: 'பாதுகாப்பு மற்றும் காவலர்', icon: 'Shield' },
  { id: '11', name: 'Tailoring & Clothing', name_ta: 'தையல் மற்றும் ஆடை', icon: 'Type' },
  { id: '12', name: 'Verification and Checking', name_ta: 'சரிபார்ப்பு மற்றும் ஆய்வு', icon: 'CheckSquare' },
];
