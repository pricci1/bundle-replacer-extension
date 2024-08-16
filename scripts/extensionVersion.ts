import packageJson from "../package.json";

export const packageVersion = packageJson.version;

export const getExtensionVersion = () => {
  const [major, minor, patch, label = "0"] = packageVersion
    .replace(/[^\d.-]+/g, "")
    .split(/[.-]/);

  return `${major}.${minor}.${patch}.${label}`;
};
