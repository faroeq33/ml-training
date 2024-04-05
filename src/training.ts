import "./index.css";
import getAllPoses from "./loadData";

const poseData = getAllPoses();

poseData.then((data) => {
  run(data);
});

type Pose = { vector: []; label: string };
type inputData = { trainingData: Pose[]; testingData: Pose[] };

// gebruik de train en test data om de nn te trainen
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

  const trainingOptions = { epochs: 50, learningRate: 0.2 };

  nn.train(trainingOptions, onTrained); // 1param: options?, 2param: callback?, 3param: callback

  function onTrained() {
    console.info("Model is trained");

    // saveModel(nn);
    console.warn("saving model is disabled");
  }
}

function saveModel(nn) {
  nn.save();
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div></div>
`;
