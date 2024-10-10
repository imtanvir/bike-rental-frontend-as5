export const leftHoursCalculate = (createdTime: Date) => {
  const startTime = new Date(createdTime);
  const targetTime: Date = new Date(startTime.getTime() + 24 * 60 * 60 * 1000);

  const currentTime: Date = new Date();

  const differenceInMs = targetTime.getTime() - currentTime.getTime();

  const hoursLeft = differenceInMs / (1000 * 60 * 60);
  return Math.max(0, Math.floor(hoursLeft));
};
