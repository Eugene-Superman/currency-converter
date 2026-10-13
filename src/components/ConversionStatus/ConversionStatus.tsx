interface Props {
  isConverting: boolean;
  fromAmount: string;
  fromCode: string;
  toAmount: string;
  toCode: string;
}

// Status for screen readers
export default function ConversionStatus({
  isConverting,
  fromAmount,
  fromCode,
  toAmount,
  toCode,
}: Props) {
  let message = "";
  if (isConverting) {
    message = "Converting...";
  } else if (fromAmount && toAmount) {
    message = `${fromAmount} ${fromCode} = ${toAmount} ${toCode}`;
  }

  return (
    <p role="status" className="visually-hidden">
      {message}
    </p>
  );
}
