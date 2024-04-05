function getPoses(url: string): Promise<[]> {
  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data.data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

const pauseUrl = "../data/rawposes-5-4-2024@19h58m42s.json";

export function getAllPoses() {
  return getPoses(pauseUrl).then((data) => {
    // Combineer de data van de verschillende poses & Shuffle de data
    const sortedData = data.flat().sort(() => Math.random() - 0.5);

    // console.log("after fetching poses", sortedData);

    // Splits de data in train en test data
    const trainingData = sortedData.slice(
      0,
      Math.floor(sortedData.length * 0.8)
    );
    saveToLocalstorage("trainingData", trainingData);

    const testingData = sortedData.slice(
      Math.floor(sortedData.length * 0.8) + 1
    );
    saveToLocalstorage("testingData", testingData);
    return { trainingData, testingData };
  });
}

function saveToLocalstorage(keyName = "pose-", myPoses: unknown) {
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
  console.log("saved to localstorage", keyWithDate);

  return finalPoses;
}

export default getAllPoses;
