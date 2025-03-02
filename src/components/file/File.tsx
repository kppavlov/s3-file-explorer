import "./file.css";

type Props = {
  value: string;
};

export const File = ({ value }: Props) => {
  console.log(value);
  return <div className="file-styles">{value}</div>;
};
