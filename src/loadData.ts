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
      const testingData = flattenedData.slice(
        Math.floor(flattenedData.length * 0.8) + 1
      );
      return { trainingData, testingData };

      // gebruik de train en test data om de nn te trainen
    })
    .then((data) => data);
}
