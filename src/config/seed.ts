const eliteControlCircuit = {
  input: {
    reinforcedAlloy: 2,
    advancedControlCircuit: 1
  },
  output: 1
};
const advancedControlCircuit = {
  input: {
    infusedAlloy: 2,
    basicControlCircuit: 1
  },
  output: 1
};
const basicControlCircuit = {
  input: { osmium: 1 },
  output: 1
};
const reinforcedAlloy = {
  input: { infusedAlloy: 1 },
  output: 1
};
const infusedAlloy = {
  input: { iron: 1 },
  output: 1
};
export default {
  eliteControlCircuit,
  advancedControlCircuit,
  basicControlCircuit,
  reinforcedAlloy,
  infusedAlloy
};
