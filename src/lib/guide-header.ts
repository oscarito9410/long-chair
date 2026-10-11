const headerSeparator = "\u00b7";

export function guideLead(quote: string): string {
  const stop = quote.indexOf(".");
  if (stop <= 0) {
    return quote;
  }
  return quote.slice(0, stop);
}

export function guideHeader(personality: string, quote: string): string {
  return `${personality} ${headerSeparator} ${guideLead(quote)}`;
}
