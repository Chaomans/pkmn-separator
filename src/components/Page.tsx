import { useState } from "react";
import Content from "./Content";
import Header from "./Header";
import { DisplayableLine, Separation, Version, VersionIndex } from "./model";

export default function Page() {
  const [fileText, setFileText] = useState("");
  const [linesToSeparate, setLinesToSeparate] = useState<DisplayableLine[]>([]);

  const onLoadFileText = (files: FileList) => {
    const file = files.item(0);
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onloadend = () => {
        setFileText(reader.result as string);
        prepareLines(reader.result as string);
      };
    }
  };

  const handleReset = () => {
    if (!fileText) return;
    prepareLines(fileText);
  };

  const prepareLines = (text: string) => {
    const lines = text.split("\r\n");
    const preparedLines: DisplayableLine[] = [];
    const separate =
      /^Dialogue: (?:[a-zàâçéèêëîïôûùüÿñæœ0-9:.\-_]*,){9}(?:{.+})?(.+)/i;
    lines.forEach((line, index) => {
      const match = line.match(separate);
      if (line.includes(" // ") && match) {
        const text = match[1];
        const toSeparate = findVersion(text);
        preparedLines.push({
          index,
          line: text,
          toSeparate,
        });
      }
    });
    setLinesToSeparate(preparedLines);
  };

  const findVersion = (line: string): Separation[] => {
    const separate = /[a-zàâçéèêëîïôûùüÿñæœ-]+ \/\/ [a-zàâçéèêëîïôûùüÿñæœ-]+/gi;
    const separations: Separation[] = [];
    let match;
    while ((match = separate.exec(line)) !== null) {
      console.log(match);
      separations.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        id: crypto.randomUUID(),
      });
    }
    return separations;
  };

  const handleChangeSelection = (
    index: number,
    selection: Selection,
    separation: Separation,
    version: Version,
    id: string
  ) => {
    const sel = selection.toString();
    const versionIndex: VersionIndex = { FR: 1, JAP: 0 };
    const splitted = separation.text.split(" // ")[versionIndex[version]];
    if (splitted) {
      const newLines = linesToSeparate.map((line) => {
        if (line.index !== index) {
          return line;
        }
        const newSeparations = line.toSeparate.map((sep) => {
          if (sep.id !== id) return sep;
          const newText = sep.text.replace(splitted, sel);
          if (version === "JAP") {
            for (let i = sep.start + splitted.length; i >= 0; i--) {
              if (line.line.slice(i, sep.start + splitted.length) === sel) {
                return {
                  ...sep,
                  start: i,
                  text: newText,
                };
              }
            }
          }
          for (let i = 0; i <= line.line.length; i++) {
            if (
              line.line.slice(
                sep.start + sep.text.lastIndexOf("/") + 2,
                sep.start + sep.text.lastIndexOf("/") + 2 + i
              ) === sel
            ) {
              return {
                ...sep,
                end: sep.start + sep.text.lastIndexOf("/") + 2 + i,
                text: newText,
              };
            }
          }
          return sep;
        });
        return {
          ...line,
          toSeparate: newSeparations,
        };
      });
      setLinesToSeparate(newLines);
    }
  };

  const hangleGenerate = (version: Version) => {
    const old = document.querySelector("a");
    if (old) {
      old.remove();
    }
    const element = document.createElement("a");
    const versionIndex: VersionIndex = { FR: 1, JAP: 0 };
    const text = fileText.split("\r\n").map((line, index) => {
      if (!line.includes(" // ")) return line;
      const toReplace = linesToSeparate.find((lts) => lts.index === index);
      if (!toReplace) return line;
      let newLine = toReplace.line;
      toReplace.toSeparate
        .sort((a, b) => b.start - a.start)
        .forEach((sep) => {
          newLine =
            newLine.slice(0, sep.start) +
            sep.text.split(" // ")[versionIndex[version]] +
            newLine.slice(sep.end);
        });
      return line.replace(toReplace.line, newLine);
    });
    const file = new Blob([text.join("\r\n")], {
      type: "text/plain;charset=utf-8",
    });
    element.href = URL.createObjectURL(file);
    element.download = version + ".ass";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <section>
      <Header onLoadFile={onLoadFileText} onReset={handleReset} />
      {fileText.length > 0 && (
        <Content
          textToSeparate={linesToSeparate}
          onChangeSelection={handleChangeSelection}
          onGenerate={hangleGenerate}
        />
      )}
    </section>
  );
}
