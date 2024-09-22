export type TBike = {
  _id: string;
  image: string | null;
  name: string;
  description: string;
  pricePerHour: string;
  rating: number;
  totalRating: number;
  isAvailable: boolean;
  cc: number;
  year: number;
  model: string;
  brand: string;
  weight: string;
  frameSize: string;
  tireSize: string;
  gears: string;
  features: string[];
};
