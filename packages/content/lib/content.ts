import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const root = process.cwd()

export async function getFiles(dataType: string) {
  return fs.readdirSync(path.join(root, dataType), 'utf-8')
}

export async function getBySlug(dataType: string, slug: string) {
  const source = fs.readFileSync(path.join(root, dataType, `${slug}.md`), 'utf-8')

  const { data, content } = matter(source)

  return {
    frontMatter: data,
    markdownBody: content,
  }
}

export async function getAllWithFrontMatter(dataType: string) {
  const files = fs.readdirSync(path.join(root, dataType))

  // @ts-ignore
  return files.reduce((allItems, slug) => {
    const source = fs.readFileSync(path.join(root, dataType, slug), 'utf-8')
    const { data } = matter(source)

    return [
      {
        frontMatter: data,
        slug: slug.replace('.md', ''),
      },
      ...allItems,
    ]
  }, [])
}
