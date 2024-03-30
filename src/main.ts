import "./index.css";
import testPoses from "./testPoses";

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
  const flattenedData = data.flat();
  run(flattenedData);
});

type Pose = { vector: []; label: string };

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div></div>
`;

function run(data: Pose[]) {
  // @ts-expect-error - no types available
  const nn = ml5.neuralNetwork({ task: "classification", debug: true });

  // valideer data
  data.forEach((pose: Pose) => {
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
  data.forEach((pose: Pose) => {
    nn.addData(pose.vector, { label: pose.label });
  });

  nn.normalizeData();

  nn.train({ epochs: 32 }, finishedTraining);

  function finishedTraining() {
    nn.classify(testPoses.fullscreenPose.vector, handleResults);
  }

  function handleResults(error: unknown, result: unknown) {
    if (error) {
      console.error(error);
      return;
    }
    console.log(result); // {label: 'red', confidence: 0.8};
  }
}
