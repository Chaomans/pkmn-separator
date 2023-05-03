import { useState } from "react";
import Content from "./Content";
import Header from "./Header";
import { DisplayableLine, Separation } from "./model";

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

  const prepareLines = (text: string) => {
    const lines = text.split("\n");
    const preparedLines: DisplayableLine[] = [];
    const separate = /^Dialogue: (?:[a-z0-9:.]*,){9}(?:{.+})*(.+)/i;
    lines.forEach((line, index) => {
      const match = line.match(separate);
      if (line.includes("//") && match) {
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
      separations.push({
        start: match.index,
        text: match[0],
      });
    }
    return separations;
  };

  return (
    <section>
      <Header onLoadFile={onLoadFileText} />
      {fileText.length > 0 && <Content textToSeparate={linesToSeparate} />}
    </section>
  );
}
