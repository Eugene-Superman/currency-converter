const AMOUNT_INPUT_PATTERN = /^\d*([.,]\d*)?$/;
function isValidInput(value: string): boolean {
  return AMOUNT_INPUT_PATTERN.test(value);
}

function format(value: number, precision: number = 2): string {
  return new Intl.NumberFormat(navigator.language, {
    numberingSystem: "latn",
    useGrouping: false,
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value);
}

function parseToNumber(value: string) {
  if (!isValidInput(value) || !/\d/.test(value)) {
    return null;
  }

  const amount = Number(value.replace(",", "."));
  return Number.isFinite(amount) ? amount : null;
}

function formatToConvert(value: number): string {
  return value.toLocaleString("en-US", {
    useGrouping: false,
    maximumFractionDigits: 20,
  });
}

export const amountUtils = {
  isValidInput,
  format,
  parseToNumber,
  formatToConvert,
};
