export const saveToLocalstorage = (keyName = "pose-", myPoses: unknown) => {
  // localStorage.setItem(`myPoses-${datetime}`, JSON.stringify(myPoses));
  const currentdate = new Date();

  const datetime =
    currentdate.getDate() +
    "-" +
    (currentdate.getMonth() + 1) +
    "-" +
    currentdate.getFullYear() +
    "@" +
    currentdate.getHours() +
    "h" +
    currentdate.getMinutes() +
    "m" +
    currentdate.getSeconds() +
    "s";

  const finalPoses = JSON.stringify({ data: myPoses }, null, 2);

  // console.log("finalPoses", finalPoses);
  const keyWithDate = `${keyName}-${datetime}`;

  localStorage.setItem(`${keyName}`, finalPoses);
  console.log("saved to localstorage: ", keyWithDate);

  return finalPoses;
};
