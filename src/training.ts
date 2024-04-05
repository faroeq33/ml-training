import "./index.css";
import { getAllPoses } from "./loadData";

// Combineer de data van de verschillende poses zodat de nn onderscheid kan maken tussen de verschillende poses
getAllPoses()
  .then((data) => data) // just for formatting
  .then((data) => {
    // gebruik de train en test data om de nn te trainen
    run(data);
  });

type Pose = { vector: []; label: string };
type inputData = { trainingData: Pose[]; testingData: Pose[] };

function run({ trainingData }: inputData) {
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

  nn.train({ epochs: 32 }, () => saveModel()); // 1param: options?, 2param: callback?, 3param: callback

  function saveModel() {
    nn.save();
  }
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div></div>
`;
