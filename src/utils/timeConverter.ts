export const timeConverter = (time: Date) => {
  const convertedTime = new Date(time).toLocaleString().slice(0, 26);

  return convertedTime;
};
