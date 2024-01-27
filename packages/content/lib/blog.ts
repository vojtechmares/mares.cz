import { getFiles, getAllWithFrontMatter, getBySlug } from "./content";

const dataType = "blog";

export async function getPostFiles() {
  return getFiles(dataType);
}

export async function getPostBySlug(slug: string) {
  return getBySlug(dataType, slug);
}

export async function getAllPostsWithFrontMatter() {
  return getAllWithFrontMatter(dataType);
}
