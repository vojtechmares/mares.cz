import {Container} from "@/components/Container"
import {Section} from "@/components/ui/section"

export function CallToAction({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  return (
    <Section id={id} background="amber">
      <Container>{children}</Container>
    </Section>
  )
}
