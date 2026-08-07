const asins = [
  'B07XQ8P6S1', 'B075F38KMD', 'B07MSLFF61', 'B083321VT8', 'B075FR8X3P',
  'B08N5NKBRP', 'B076VZLN7D', 'B0912K68L1', 'B07MY9S6S1', 'B08F9N12KL',
  'B07Q8G7K5D', 'B07Z49V9LL', '8550807567', 'B08N5WRWNW', 'B09B2CZPSS',
  'B0B8K3ZSK6', 'B0C78Q1G58', 'B08X5H8D9K'
];

async function check() {
  for (const asin of asins) {
    try {
      const res = await fetch(`https://www.amazon.com.br/dp/${asin}`);
      console.log(`${asin}: ${res.status}`);
    } catch (e) {
      console.log(`${asin}: error`);
    }
  }
}
check();
