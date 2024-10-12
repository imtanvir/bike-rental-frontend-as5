export const isReturnTimeValid = (
  startDateTime: string,
  returnDateTime: string
) => {
  const start = new Date(startDateTime);
  const returnTime = new Date(returnDateTime);

  return returnTime >= start;
};
