export const handler = async (event, context) => {
  console.log("GPAPHQL INPUT: \n" + JSON.stringify(event, null, 2));

  return [
    {
      deviceId: "1",
    },
  ];
};
