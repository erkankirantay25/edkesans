// types.ts

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  totalDemand?: number; // Bu ürüne olan toplam talep (gram)
}


export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  createdAt: any; 
  userCode: string; 
  role: 'user' | 'admin';
  isBanned: boolean;
  isActive: boolean;
}

export interface Demand {
  id: string; 
  userId: string;
  userCode: string;
  productId: string;
  productName: string;
  quantity: number; 
  status: 'valid' | 'pending_quota' | 'invalid';
  createdAt: any; // Firebase Timestamp
  orderInQueue: number; // Üründeki talep sırası
}

export interface SiteSettings {
  isSalesOpen: boolean;
  announcement: {
    isEnabled: boolean;
    title: string;
    message: string;
  };
  lastUserCode: number;
}