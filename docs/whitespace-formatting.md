# Fragment Pattern for Whitespace-Sensitive HTML

This document explains the pattern used to prevent whitespace artifacts when rendering inline elements with CSS underlines.

## The Problem

When Prettier formats Astro/JSX code, it adds line breaks and indentation around inline elements. With `htmlWhitespaceSensitivity: "strict"`, this whitespace is preserved in the rendered HTML, causing visual artifacts:

- CSS `underline` decorations extend beyond the visible text
- Extra spaces appear between inline elements

**Before (problematic formatting):**

```astro
{
  tags.map((tag) => (
    <>
      <a href={`/blog/tag/${tag}`} class="underline">
        #{tag}
      </a>{" "}
    </>
  ))
}
```

The line breaks around the `<a>` tag create whitespace that the underline extends through.

## The Solution

Use `prettier-ignore` comments to keep inline elements on a single line, wrapped in fragments:

```astro
{
  tags.map((tag) =>
    // prettier-ignore
    <><a href={`/blog/tag/${tag}`} class="underline">#{tag}</a>{" "}</>,
  )
}
```

Or using the JSX comment style (useful when the entire line needs protection):

<!-- prettier-ignore -->
```text
{/* prettier-ignore */}
<p class="mt-2">{tags.map((tag) => <Fragment><a href={`/blog/tag/${tag}`} class="underline">#{tag}</a>{" "}</Fragment>)}</p>
```

## Key Elements

1. **Fragment (`<></>` or `<Fragment>`)** - Wraps inline content without adding DOM elements
2. **`prettier-ignore` comment** - Prevents Prettier from reformatting the line
3. **Single-line formatting** - Eliminates whitespace artifacts
4. **`{" "}` for spacing** - Explicit space between items instead of relying on whitespace

## When to Use

Use this pattern when:

- Rendering lists of inline elements with `.map()`
- Elements have CSS `underline` or similar text decorations
- Whitespace between elements would cause visual artifacts

## Configuration

This pattern works with the project's Prettier configuration in `.prettierrc.json`:

```json
{
  "htmlWhitespaceSensitivity": "strict"
}
```

The `strict` setting preserves whitespace exactly as written, which is why controlling whitespace manually with this pattern is necessary.

## Examples in Codebase

- `src/pages/blog/index.astro` - Tag links and year archive links
- `src/pages/blog/[year]/index.astro` - Month navigation links
- `src/pages/blog/tag/[tag]/index.astro` - Tag links on filtered pages
