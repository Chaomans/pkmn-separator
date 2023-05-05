import { useState } from "react";
import { DisplayableLine } from "./model";
import classNames from "classnames";

type TextDisplayProps = {
  title: string;
  lines: DisplayableLine[];
};

export default function TextDisplay({ lines, title }: TextDisplayProps) {
  const [editing, setEditing] = useState([0, ""]);

  const formatLine = (line: DisplayableLine) => {
    let toDisplay: string = line.line;
    let sliced: JSX.Element[] = line.toSeparate
      .sort((a, b) => b.start - a.start)
      .map((separation) => {
        const formatted = (
          <>
            {highlight(line.index, separation.text)}
            {toDisplay.slice(separation.start + separation.text.length)}
          </>
        );
        toDisplay = line.line.slice(0, separation.start);
        return formatted;
      })
      .reverse();
    return (
      <p>
        {toDisplay}
        {sliced}
      </p>
    );
  };

  const highlight = (index: number, text: string) => {
    const splitted = text.split(" // ");
    return (
      <>
        <span
          className={classNames({
            highlight: true,
            JAP: true,
            editing: editing[0] === index && editing[1] === "JAP",
          })}
          onClick={() => setEditing([index, "JAP"])}
        >
          {splitted[0]}
        </span>{" "}
        //{" "}
        <span
          className={classNames({
            highlight: true,
            FR: true,
            editing: editing[0] === index && editing[1] === "FR",
          })}
          onClick={() => setEditing([index, "FR"])}
        >
          {splitted[1]}
        </span>
      </>
    );
  };

  return (
    <div>
      <h2>{title}</h2>
      <ul onDoubleClick={() => setEditing([0, ""])}>
        {lines.map((line) => (
          <li key={line.index} className="displayableLine">
            <span className="line-number">{line.index + 1}:</span>
            {formatLine(line)}
          </li>
        ))}
      </ul>
    </div>
  );
}
