import TextDisplay from "./TextDisplay";
import { DisplayableLine } from "./model";

type ContentProps = {
  textToSeparate: DisplayableLine[];
};

export default function Content({ textToSeparate }: ContentProps) {
  return (
    <section>
      <div>
        <button>JAP</button>
        <button>BOTH</button>
        <button>FR</button>
      </div>
      <div>
        <TextDisplay title="Original" lines={textToSeparate} />
      </div>
    </section>
  );
}
