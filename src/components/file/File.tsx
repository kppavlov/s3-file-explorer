import "./file.css";

type Props = {
  value: string;
};

export const File = ({ value }: Props) => {
  return <div className="file-styles">{value}</div>;
};
