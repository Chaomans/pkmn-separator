import { useState } from 'react';
import Content from './Content'
import Header from './Header'
import { DisplayableLine } from './model';

export default function Page() {
  const [fileText, setFileText] = useState("");
  const [linesToSeparate, setLinesToSeparate] = useState<DisplayableLine[]>([]);

  const version = {jp: 0, fr: 1};
  
  const onLoadFileText = (files: FileList) => {
    const file = files.item(0);
    if(file){
      const reader = new FileReader();
      reader.readAsText(file)
      reader.onloadend = () => {
        setFileText(reader.result as string)
        prepareLines(reader.result as string)
      }
    }
  }

  const prepareLines = (text: string) => {
    const lines = text.split("\n");
    const toSeparate: DisplayableLine[] = [];
    const separate = /^Dialogue: (?:[a-z0-9:.]*,){9}(?:{.+})*(.+)/i
    lines.forEach((line, index) => {
      const match = line.match(separate)
      if(line.includes("//") && match){
        const text = match[1]
        const [fr, jp] = replaceVersion(text);
        toSeparate.push({
          index,
          text,
          fr,
          jp,
        })
      }
    })
    setLinesToSeparate(toSeparate)
  }

  const replaceVersion = (line: string) => {
    const separate = /([a-zàâçéèêëîïôûùüÿñæœ-]+) \/\/ ([a-zàâçéèêëîïôûùüÿñæœ-]+)/i;
    const match = line.match(separate);
    if(!match) return ["", ""];
    return [line.replace(match[0], match[version.jp]), line.replace(match[0], match[version.fr])]
  }

  return (
    <section>
      <Header onLoadFile={onLoadFileText}/>
      {fileText.length > 0 && 
        <Content textToSeparate={linesToSeparate} />
      }
    </section>
  )
}
