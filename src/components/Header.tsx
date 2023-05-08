type HeaderProps = {
  onLoadFile: (files: FileList) => void;
  onReset: () => void;
};

export default function Header({ onLoadFile, onReset }: HeaderProps) {
  return (
    <div className="div">
      <h1>Pokemon-separator</h1>
      <input
        type="file"
        id="loadfile"
        accept=".ass"
        onChange={(e) => {
          !e.target.files || onLoadFile(e.target.files);
        }}
        name="Load File"
      />
      <button onClick={() => onReset()}>Reset</button>
    </div>
  );
}
