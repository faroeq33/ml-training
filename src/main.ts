import "./index.css";

// @ts-expect-error - no types available
import * as ml5 from "ml5";
console.log();
const nn = neuralNetwork({ task: "classification", debug: true });
nn.addData([18, 9.2, 8.1, 2], { label: "cat" });
nn.addData([20.1, 17, 15.5, 5], { label: "dog" });
// vul hier zelf de rest van de data in
// ...
nn.normalizeData();
nn.train({ epochs: 10 }, () => finishedTraining());
async function finishedTraining() {
  const results = await nn.classify([29, 11, 10, 3]);
  console.log(results);
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div></div>
`;
