import TextDisplay from "./TextDisplay"
import { DisplayableLine } from "./model"

type ContentProps = {
    textToSeparate: DisplayableLine[]
}

export default function Content({textToSeparate}: ContentProps) {
  return (
    <section>
        <div><TextDisplay title="JAP" lines={textToSeparate.map(dp => ({index: dp.index, text: dp.jp ?? ""}))} /></div>
        <div><TextDisplay title="Original" lines={textToSeparate.map(dp => ({index: dp.index, text: dp.text}))} /></div>
        <div><TextDisplay title="FR" lines={textToSeparate.map(dp => ({index: dp.index, text: dp.fr ?? ""}))} /></div>
    </section>
  )
}
