function getPoses(url: string): Promise<[]> {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data.data;
    });
}

const pauseUrl = "../data/pauseposes-29-3-2024@13h54m17s.json";
const fullscreenUrl = "../data/fullscreen-poses-29-3-2024@14h8m34s.json";
const muteUrl = "../data/muteposes-29-3-2024@13h51m24s.json";

export function getAllPoses() {
  return Promise.all([
    getPoses(pauseUrl),
    getPoses(muteUrl),
    getPoses(fullscreenUrl),
  ])
    .then((data) => {
      // Combineer de data van de verschillende poses
      const flattenedData = data.flat();

      // Shuffle/schud de data
      flattenedData.sort(() => Math.random() - 0.5);

      // Splits de data in train en test data
      const trainingData = flattenedData.slice(
        0,
        Math.floor(flattenedData.length * 0.8)
      );
      console.log("testing loading");

      saveToLocalstorage("trainingsposes", trainingData); //localstorage
      const testingData = flattenedData.slice(
        Math.floor(flattenedData.length * 0.8) + 1
      );
      saveToLocalstorage("trainingsposes", testingData);
      return { trainingData, testingData };

      // gebruik de train en test data om de nn te trainen
    })
    .then((data) => data);
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
  localStorage.setItem(`${keyName}-${datetime}`, "test");

  // const blob = new Blob([finalPoses], { type: "application/json" });
  // const url = URL.createObjectURL(blob);
  // const link = document.createElement("a");
  // link.href = url;
  // link.download = `poses-${datetime}.json`;
  // link.click();
  // URL.revokeObjectURL(url);
}
