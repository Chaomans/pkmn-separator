import { useState } from "react";
import { DisplayableLine, Separation, Version } from "./model";
import classNames from "classnames";

type TextDisplayProps = {
  title: string;
  lines: DisplayableLine[];
  onChangeSelection: (
    index: number,
    selection: Selection,
    separation: Separation,
    version: Version,
    id: string
  ) => void;
};

export default function TextDisplay({
  lines,
  title,
  onChangeSelection,
}: TextDisplayProps) {
  const [editing, setEditing] = useState([0, "", ""]);
  const version = { fr: "FR", jp: "JAP" };

  const formatLine = (line: DisplayableLine) => {
    let toDisplay: string = line.line;
    let sliced: JSX.Element[] = line.toSeparate
      .sort((a, b) => b.start - a.start)
      .map((separation) => {
        const formatted = (
          <>
            {highlight(line.index, separation.text, separation.id)}
            {toDisplay.slice(separation.start + separation.text.length)}
          </>
        );
        toDisplay = line.line.slice(0, separation.start);
        return formatted;
      })
      .reverse();
    return (
      <p
        className={classNames({
          isEditingFR: editing[0] === line.index && editing[1] === version.fr,
          isEditingJAP: editing[0] === line.index && editing[1] === version.jp,
        })}
      >
        {toDisplay}
        {sliced}
      </p>
    );
  };

  const highlight = (index: number, text: string, id: string) => {
    const splitted = text.split(" // ");
    return (
      <>
        <span
          className={classNames({
            highlight: true,
            JAP: true,
            editing:
              editing[0] === index &&
              editing[1] === version.jp &&
              id === editing[2],
          })}
          onClick={() => setEditing([index, version.jp, id])}
        >
          {splitted[0]}
        </span>{" "}
        //{" "}
        <span
          className={classNames({
            highlight: true,
            FR: true,
            editing:
              editing[0] === index &&
              editing[1] === version.fr &&
              id === editing[2],
          })}
          onClick={() => setEditing([index, version.fr, id])}
        >
          {splitted[1]}
        </span>
      </>
    );
  };

  const onSelection = (
    index: number,
    selection: Selection | null,
    separations: Separation[]
  ) => {
    if (index !== editing[0]) return;
    if (!selection) return;
    const sel = selection.toString();
    if (!sel || sel.includes("/") || sel.includes("\n")) return;
    const ver: Version = editing[1] === version.fr ? "FR" : "JAP";
    const separation = separations.find((sep) => sep.id === editing[2]);
    if (!separation) return;
    onChangeSelection(index, selection, separation, ver, editing[2] as string);
    setEditing([0, "", ""]);
  };

  return (
    <div>
      <h2>{title}</h2>
      <ul onDoubleClick={() => setEditing([0, "", ""])}>
        {lines.map((line) => (
          <li
            key={line.index}
            className="displayableLine"
            onMouseUp={() =>
              onSelection(line.index, document.getSelection(), line.toSeparate)
            }
          >
            <span className="line-number">{line.index + 1}:</span>
            {formatLine(line)}
          </li>
        ))}
      </ul>
    </div>
  );
}
