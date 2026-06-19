export interface AdminStats {
  users: {
    total: number;
    clients: number;
    vendors: number;
    verified: number;
  };
  products: {
    total: number;
  };
  sales: {
    total: number;
  };
  kyc: {
    pending: number;
    approved: number;
  };
}
