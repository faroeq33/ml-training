import "./index.css";

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

const pausePoses = getPoses(pauseUrl);
const musePoses = getPoses(muteUrl);
const fullscreenPoses = getPoses(fullscreenUrl);

// Combineer de data van de verschillende poses zodat de nn onderscheid kan maken tussen de verschillende poses
Promise.all([pausePoses, musePoses, fullscreenPoses]).then((data) => {
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

  // gebruik de train en test data om de nn te trainen
  run({ trainingData, testingData });
});

type Pose = { vector: []; label: string };
type inputData = { trainingData: Pose[]; testingData: Pose[] };

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div></div>
`;

function run({ trainingData, testingData }: inputData) {
  // @ts-expect-error - no types available
  const nn = ml5.neuralNetwork({ task: "classification", debug: true });

  // valideer data
  trainingData.forEach((pose: Pose) => {
    // check if there are more than 2 different labels
    if (
      pose.label !== "pause" &&
      pose.label !== "fullscreen" &&
      pose.label !== "mute"
    ) {
      throw new Error("Your data has to consist of multiple labels");
    }
  });

  // Voeg data toe aan de neural network
  trainingData.forEach((pose: Pose) => {
    nn.addData(pose.vector, { label: pose.label });
  });

  nn.normalizeData();

  nn.train({ epochs: 32 }, classify);

  async function classify() {
    // houd bij hoeveel voorspellingen correct zijn
    let correctPredictions = 0;

    // Loop over de test data en voorspel de labels
    for (const d of testingData) {
      const result = await nn.classify(d.vector);
      const { label: topSpellingLabel } = result[0];
      const { label: correctAnswer } = d;
      console.log(
        `Ik voorspelde: ${topSpellingLabel}. Het correcte antwoord is: ${correctAnswer}`
      );
      if (topSpellingLabel === correctAnswer) {
        correctPredictions++;
      }
    }

    // Bereken de accuracy door het aantal correcte voorspellingen te delen door het aantal test data
    const accuracy = (correctPredictions / testingData.length) * 100;

    console.log(`Accuracy: ${accuracy}%`);
  }

  // function handleResults(error: unknown, result: unknown) {
  //   if (error) {
  //     console.error(error);
  //     return;
  //   }
  //   console.log(result); // {label: 'red', confidence: 0.8};
  // }
}
