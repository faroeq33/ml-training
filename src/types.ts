export type ResponseBody = {
  data: Pose[];
  metaData: {
    datetime: string;
    totalPoses: number;
  };
};
export type Pose = { vector: []; label: string };
