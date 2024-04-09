# ML training
This is the project where models get trained on pose data.

## Run dev server
```sh
npm run dev
```

## How save data to localstorage
In loadData.ts the trainingdata is split into training & testdata. The splitting happens after running getAllPoses(). After that the trainingdata would be available in localstorage in order to use your data to for testing.