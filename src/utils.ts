import { onMounted, reactive, toRef } from "vue";

export type Data = {
  category: string;
  amount: string;
  currency: string;
  [key: string]: string;
};

export function useExampleData<T extends Record<string, any>>() {
  const data = reactive<{ value: null | T[] }>({
    value: null,
  });// as Reactive<T>;

  onMounted(() => {
    fetch("http://localhost:5173/example_data.csv")
      .then((r) => r.text())
      .then((r) => ((data.value as T[]) = csvToArray<T>(r)));
  });

  return toRef(() => data.value);
}

export function dataGroup<T extends Record<string, any>, K extends keyof T>(
  input: T[],
  key: K,
) {
  return input.reduce(
    (acc, curr) => {
      const item = { ...curr };
      const groupedValue = item[key];
      delete item[key];

      acc[groupedValue] ??= [];
      acc[groupedValue].push(item);

      return acc;
    },
    {} as Record<T[K], T[]>,
  );
}

function csvToArray<T extends Record<string, any>>(input: string) {
  const lines = input.trim().split("\n");
  const headerLine = lines.shift()!;
  const headers = headerLine.split(",");

  return lines.map((line) => {
    const values = line.split(",");

    if (values.length !== headers.length) {
      throw Error("values.length !== headers.length");
    }

    return headers.reduce(
      (acc, header, idx) => {
        const value = values[idx];
        acc[header] = value;
        return acc;
      },
      {} as Record<string, string>,
    );
  }) as T[];
}

function convertItem2Xml(item: Record<string, any>){
  let itemXml = "";
  for (let [key, val] of Object.entries(item)) {
    let itemValue = String(val);
    if(itemValue.includes("&"))
        itemValue = itemValue.replace("&", "&amp;");
    
    if(itemValue.includes("<"))
       itemValue = itemValue.replace("<", "&lt;");
    
    if(itemValue.includes(">"))
         itemValue = itemValue.replace(">", "&gt;");

    if(itemValue.includes('"'))
         itemValue = itemValue.replace('"', "&quot;");

    if(itemValue.includes("'"))
         itemValue = itemValue.replace('"', "&apos;");

    itemXml += `<${key}>${itemValue}</${key}>`;
  }
  return `<item>${itemXml}</item>\n`;
}

export function toXml(input: Record<string, any>[]) {
  return `
  <data>
  ${input.reduce((acc, curr) => 
  `${acc}${convertItem2Xml(curr)}`, "").trimEnd()}
  </data>`.trimStart();
}

// @ts-ignore
export async function plnToCurrency(curr: string) {
  if (curr.toLowerCase() === "pln") return 1;

  const res = await fetch(
    `http://localhost:5173/currency/pln-to-${curr.toLowerCase()}`,
  );
  const text = await res.text();
  return Number(text.trim());
}
