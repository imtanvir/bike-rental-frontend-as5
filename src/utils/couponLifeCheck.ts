export const couponLifeCheck = (createdTime: string) => {
  // Get the current time
  const currentTime = new Date();

  const createTime = new Date(createdTime);
  const couponExpiryTime = new Date(createTime.getTime() + 24 * 60 * 60 * 1000);

  if (currentTime < couponExpiryTime) {
    return true;
  } else {
    return false;
  }
};
