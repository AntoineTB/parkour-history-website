import { writeFile, readFile } from "fs/promises";
import _ from 'lodash';

const formatMoney = (amount, currency) => {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(amount);
}

try {
  const money = JSON.parse((await readFile("../../docs/_data/money.json")).toString());
  const combined = [
    ...money.capex.map(x => ({ ...x, type: 'capex', formatted: formatMoney(x.amount, x.currency) })),
    ...money.opex.map(x => ({ ...x, type: 'opex', formatted: formatMoney(x.amount, x.currency) })),
  ]
  const lastEntry = _.maxBy(combined, 'when').when;
  const capexByCurrency = _.groupBy(money.capex, 'currency');
  const opexByCurrency = _.groupBy(money.opex, 'currency');
  const capexSummary = Object.keys(capexByCurrency).map(currency => {
    const total = _.sumBy(capexByCurrency[currency], 'amount');
    return {
      currency,
      total,
      formatted: formatMoney(total, currency),
      transactions: capexByCurrency[currency].length,
    }
  });
  const opexSummary = Object.keys(opexByCurrency).map(currency => {
    const total = _.sumBy(opexByCurrency[currency], 'amount');
    return {
      currency,
      total,
      formatted: formatMoney(total, currency),
      transactions: opexByCurrency[currency].length,
    }
  });
  const allSymbols = _.uniq([...Object.keys(capexByCurrency), ...Object.keys(opexByCurrency)])
  capexSummary.transactions = money.capex.length;
  opexSummary.transactions = money.opex.length;
  const ratioCapexOpex = allSymbols.map(currency => {
    const c = capexSummary.find(x => x.currency === currency);
    const o = opexSummary.find(x => x.currency === currency);
    const ratio = (c && o) ? `${(100*c.total / (c.total + o.total)).toFixed(0)}% capex` : (c && !o) ? '100% capex' : (!c && o) ? '100% opex' : 'NA';
    return {
      currency,
      ratio,
    };
  });
  const byCategory = _.groupBy(combined, x => `${x.kind} - ${x.type} - ${x.currency}`);
  const summaryByCategoryPrep = Object.keys(byCategory).map(category => {
    const e = byCategory[category]
    return {
      kind: e[0].kind,
      type: e[0].type,
      currency: e[0].currency,
      transactions: e.length,
      total: formatMoney(_.sumBy(e, 'amount'), e[0].currency),
    }
  });
  const content = JSON.stringify({
    updated: new Date(),
    lastEntry,
    combined,
    capexSummary,
    opexSummary,
    ratioCapexOpex,
    summaryByCategory : _.groupBy(summaryByCategoryPrep, x=>`${x.kind} (${x.type})`),
  }, null, 2);

  await writeFile("../../docs/_data/money_compiled.json", content);

} catch (error) {
  console.error(error);
} finally {
}