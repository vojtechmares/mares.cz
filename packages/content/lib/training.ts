import { getFiles, getAllWithFrontMatter, getBySlug } from "./content";

const dataType = "training";

export async function getTrainingFiles() {
  return getFiles(dataType);
}

export async function getTrainingBySlug(slug: string) {
  return getBySlug(dataType, slug);
}

export async function getAllTrainingsWithFrontMatter() {
  return getAllWithFrontMatter(dataType);
}
