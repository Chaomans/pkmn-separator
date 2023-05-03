import { DisplayableLine } from "./model"

type TextDisplayProps = {
  title: string
  lines: DisplayableLine[],
}

export default function TextDisplay({ lines, title }: TextDisplayProps) {
  return (
    <div>
      <h2>{title}</h2>
      <ul>{lines.map(line => (
        <li key={crypto.randomUUID()}><span>{line.index}: </span>{line.text}</li>
      ))}</ul>
    </div>
  )
}
