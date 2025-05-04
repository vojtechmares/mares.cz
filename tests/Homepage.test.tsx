/**
 * @jest-environment jsdom
 */
import {render, screen, within} from "@testing-library/react"
import Home from "@/app/page"

test("homepage", async () => {
  render(await Home())

  const heading = screen.queryAllByRole("heading", {
    level: 1,
  })

  expect(heading).toBeDefined()

  const headingText = heading.map((el) => el.textContent).join("")

  expect(headingText).toBe("Jsem Vojtěch Mareš, DevOps architekt.")

  const writeMe = screen.getAllByText(/Napište mi/i)

  writeMe.map((element) => {
    // First button (in navbar) is <a><span>...</span></a>, therefore we look for parent (closest) anchor element
    if (element instanceof HTMLSpanElement) {
      const parent = element.closest("a")
      expect(parent?.getAttribute("href")).toBe("mailto:vojtech@mares.cz")
      return
    }

    expect(element.getAttribute("href")).toBe("mailto:vojtech@mares.cz")
  })

  expect(writeMe).toHaveLength(2)

  const meetMe = screen.getAllByText(/Domluvme si schůzku/i)

  meetMe.map((element) => {
    expect(element.getAttribute("href")).toBe(
      "https://cal.com/vojtechmares/30min",
    )
  })

  // const footer = within(screen.getByRole('contentinfo'))
  // const link = within(footer.getByRole('link'))
  // expect(link.getByRole('img', { name: /vercel logo/i })).toBeDefined()
})
