export const ratingAverageCalculate = (ratings: number[]) => {
  let total = 0;
  if (ratings.length > 0) {
    total = ratings.reduce((sum, rating) => sum + rating, 0);
  }
  const averageRating =
    total === 0 && ratings.length === 0 ? 0 : total / ratings.length;

  return averageRating;
};
