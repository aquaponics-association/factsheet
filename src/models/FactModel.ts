import { CategoryModel } from "./CategoryModel";
import { ResearchModel } from "./ResearchModel";

export type FactModel = {
  id: string;
  text: string;
  categories?: [CategoryModel];
  research?: [ResearchModel];
};
