export interface BusinessSector {
  id: string;
  name: string; // Added name property
  name_ta: string; // Added Tamil name property
  icon: string; // Path to SVG icon in public folder
}

export const BUSINESS_SECTORS: BusinessSector[] = [
  { id: '1', name: 'Computer & Mobile', name_ta: 'கணினி மற்றும் மொபைல்', icon: '/computer-mobile-work.svg' },
  { id: '2', name: 'Beauty & Salon', name_ta: 'அழகு மற்றும் சலூன்', icon: '/beauty-and-salon.svg' },
  { id: '3', name: 'Banking', name_ta: 'வங்கி', icon: '/money-bank-work.svg' },
  { id: '4', name: 'Teaching', name_ta: 'கற்பித்தல்', icon: '/school-and-teaching.svg' },
  { id: '5', name: 'Supermarket & Retail', name_ta: 'சூப்பர் மார்க்கெட் மற்றும் சில்லறை விற்பனை', icon: '/shop-and-sales-retail.svg' },
  { id: '6', name: 'Laundry & Ironing', name_ta: 'சலவை மற்றும் சலவை செய்தல்', icon: '/laundry-and-ironing.svg' },
  { id: '7', name: 'Factory & Production', name_ta: 'தொழிற்சாலை மற்றும் உற்பத்தி', icon: '/factory-and-production.svg' },
  { id: '8', name: 'Repair & Fixing', name_ta: 'பழுதுபார்த்தல்', icon: '/repair-and-fixing.svg' },
  { id: '9', name: 'Cleaning & Housekeeping', name_ta: 'சுத்தம் மற்றும் வீட்டு பராமரிப்பு', icon: '/cleaning-and-housekeeping.svg' },
  { id: '10', name: 'Security & Watchman', name_ta: 'பாதுகாப்பு மற்றும் காவலர்', icon: '/security-and-watchman.svg' },
  { id: '11', name: 'Tailoring & Clothing', name_ta: 'தையல் மற்றும் ஆடை', icon: '/tailoring-and-cloths.svg' },
  { id: '12', name: 'Verification and Checking', name_ta: 'சரிபார்ப்பு மற்றும் ஆய்வு', icon: '/verification-and-checking.svg' },
];

