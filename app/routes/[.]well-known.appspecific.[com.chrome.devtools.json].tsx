import path from "path";

export const loader = async () => {
  const projectRoot = path.resolve();
  const jsonData = {
    workspace: {
      root: projectRoot,
    },
  };
  return Response.json(jsonData);
};
