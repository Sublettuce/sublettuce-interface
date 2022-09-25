import type { DocumentData } from "firebase/firestore";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import tokens from "../constants/tokens.json";
import { formatUnits } from "ethers/lib/utils";

dayjs.extend(duration);

export function formatInterval(interval: string) {
  let formattedInterval;
  switch (interval) {
    case dayjs.duration(1, "day").asSeconds().toString():
      formattedInterval = "Day";
      break;
    case dayjs.duration(1, "month").asSeconds().toString():
      formattedInterval = "Month";
      break;
    case dayjs.duration(1, "year").asSeconds().toString():
      formattedInterval = "Year";
      break;
  }
  return formattedInterval;
}

export function formatRate(data: DocumentData) {
  const token = tokens.find((token) => token.address == data.tokenAddress);
  if (!token) return;
  const formattedPrice = formatUnits(data.unitsPerInterval, token.decimals);
  const formattedInterval = formatInterval(data.interval);
  const rate = `${parseFloat(formattedPrice)}/${formattedInterval}`;
  return rate;
}
