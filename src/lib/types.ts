export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  dataAiHint: string;
  dateJoined: string;
  lastOrder: string;
  status: 'Active' | 'Blocked';
  address: string;
  favorites: number;
  promoCodes: number;
  supportTickets: number;
  activitySummary: string;
};

export type Driver = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  dataAiHint: string;
  phone: string;
  vehicle: string;
  dateJoined: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  availability: 'Online' | 'Offline' | 'Busy';
  currentAssignment?: string;
};

export type Order = {
  id: string;
  customer: {
    name: string;
    avatarUrl: string;
    dataAiHint: string;
  };
  driver?: {
    name: string;
    avatarUrl: string;
    dataAiHint: string;
  };
  items: { name: string; quantity: number }[];
  status: 'Pending' | 'Accepted' | 'Preparing' | 'On The Way' | 'Delivered' | 'Cancelled';
  total: number;
  date: string;
  deliveryAddress: string;
};

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  dataAiHint: string;
  description: string;
  options: { name: string; price: number }[];
  addons: { name: string; price: number }[];
};

export type Promotion = {
  id: string;
  code: string;
  description: string;
  discount: string;
  status: 'Active' | 'Expired';
  startDate: string;
  endDate: string;
};

export type Review = {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
};
