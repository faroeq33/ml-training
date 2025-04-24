import "./index.css";
import { Pose, ResponseBody } from "./types";
import { saveToLocalstorage } from "./utils";

async function getPoses(url: string): Promise<ResponseBody> {
  try {
    const response = await fetch(url);
    const data = (await response.json()) as ResponseBody;
    console.table(data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function main() {
  const url = "../data/poses-14-2-2025@13h2m13s.json";
  const { data } = await getPoses(url);

  // Combineer de data van de verschillende poses & Shuffle de data
  const sortedData = data.flat().sort(() => Math.random() - 0.5);

  // Splits de data in train en testdata
  const trainingData = sortedData.slice(0, Math.floor(sortedData.length * 0.8));

  const testingData = sortedData.slice(Math.floor(sortedData.length * 0.8) + 1);
  // Slaat testdata voor het testen van een neuralnetwork-model
  saveToLocalstorage("testingData", testingData);

  // @ts-expect-error - geen types beschikbaar for ml5
  const mlfive = window.ml5;
  console.log(mlfive.version);

  mlfive.setBackend("webgl");

  const nn = mlfive.neuralNetwork({ task: "classification", debug: true });

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

  const trainingOptions = { epochs: 450, learningRate: 0.2 };

  // 1param: options?, 2param: callback?, 3param: callback
  nn.train(trainingOptions, () => {
    console.info("Model is trained");

    nn.save();
  });
}

main();

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div></div>
`;
