// Shared schemas for Firestore documents
// Can be used in both Next.js (TypeScript) and Flutter (Dart with json_serializable)

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  // Add other fields
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: string;
  // Add other fields
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  price: number;
}

// Zod schemas can be converted to Dart equivalents
