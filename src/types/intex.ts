export type TImage = {
  id: string;
  url: string;
  isRemove: boolean;
};
export type TBike = {
  _id: string;
  image: TImage[] | null;
  name: string;
  description: string;
  pricePerHour: number;
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
