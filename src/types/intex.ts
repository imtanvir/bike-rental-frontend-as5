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
  rating: number[];
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

type TErrorSource = {
  message: string;
  path: string;
};
export type TError = {
  data: {
    message: string;
    stack: string;
    success: boolean;
    errorSource: TErrorSource[];
  };
  status: number;
};
export type TErrorResponse = {
  error: {
    data: {
      message: string;
      stack: string;
      success: boolean;
      errorSource: TErrorSource[];
    };
    status: number;
  };
};
