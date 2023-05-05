import TextDisplay from "./TextDisplay";
import { DisplayableLine } from "./model";

type ContentProps = {
  textToSeparate: DisplayableLine[];
};

export default function Content({ textToSeparate }: ContentProps) {
  return (
    <section>
      <div>
        <TextDisplay title="Lines" lines={textToSeparate} />
      </div>
    </section>
  );
}
