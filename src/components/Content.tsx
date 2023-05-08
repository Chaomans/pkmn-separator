import TextDisplay from "./TextDisplay";
import { DisplayableLine, Separation, Version } from "./model";

type ContentProps = {
  textToSeparate: DisplayableLine[];
  onChangeSelection: (
    index: number,
    selection: Selection,
    separation: Separation,
    version: Version,
    id: string
  ) => void;
  onGenerate: (version: Version) => void;
};

export default function Content({
  textToSeparate,
  onChangeSelection,
  onGenerate,
}: ContentProps) {
  return (
    <section>
      <div>
        <button onClick={() => onGenerate("JAP")}>Generate JAP</button>
        <button onClick={() => onGenerate("FR")}>Generate FR</button>
      </div>
      <div>
        <TextDisplay
          title="Lines"
          lines={textToSeparate}
          onChangeSelection={onChangeSelection}
        />
      </div>
    </section>
  );
}
