import { DisplayableLine } from "./model";

type TextDisplayProps = {
  title: string;
  lines: DisplayableLine[];
};

export default function TextDisplay({ lines, title }: TextDisplayProps) {
  const formatLine = (line: DisplayableLine) => {
    let toDisplay = <p></p>;
    line.toSeparate.forEach((separation) => {
      toDisplay = (
        <p>
          <span className="number">{line.index}: </span>
          {line.line.slice(0, separation.start)}
          {highlight(separation.text)}
          {line.line.slice(separation.start + separation.text.length)}
        </p>
      );
    });
    console.log(toDisplay);
    return toDisplay;
  };

  const highlight = (text: string) => {
    const splitted = text.split(" // ");
    return (
      <>
        <span className="highlightJAP">{splitted[0]}</span> //{" "}
        <span className="highlightFR">{splitted[1]}</span>
      </>
    );
  };

  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {lines.map((line) => (
          <li key={crypto.randomUUID()}>{formatLine(line)}</li>
        ))}
      </ul>
    </div>
  );
}
