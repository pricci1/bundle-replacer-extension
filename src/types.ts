export type Rule = {
  selector?: string;
  url: string;
  enabled: boolean;
  hostname: string;
  type: "replace" | "inject";
};
