const steelCasing = {
  input: {
    steel: 4,
    glass: 4,
    osmium: 1,
  },
  output: 1,
};
const basicChemicalTank = {
  input: {
    redstone: 4,
    osmium: 4,
  },
  output: 1,
};
const fissionCasing = {
  input: {
    lead: 4,
    steelCasing: 1,
  },
  output: 4,
  labels: ['fissionReactor'],
};
const fissionReactorPort = {
  input: {
    fissionCasing: 4,
    eliteControlCircuit: 1,
  },
  output: 2,
  labels: ['fissionReactor'],
};
const fissionLogicAdapter = {
  input: {
    redstone: 4,
    fissionCasing: 1,
  },
  output: 1,
  labels: ['fissionReactor'],
};
const fissionFuelAssembly = {
  input: {
    lead: 6,
    steel: 1,
    basicChemicalTank: 1,
  },
  output: 1,
  labels: ['fissionReactor'],
};
const controlRodAssembly = {
  input: {
    steel: 4,
    lead: 4,
    eliteControlCircuit: 1,
  },
  output: 1,
  labels: ['fissionReactor'],
};
const reactorGlass = {
  input: {
    enrichedIron: 4,
    lead: 4,
    glass: 1,
  },
  output: 4,
  labels: ['fissionReactor'],
};
const eliteControlCircuit = {
  input: {
    reinforcedAlloy: 2,
    advancedControlCircuit: 1,
  },
  output: 1,
};
const advancedControlCircuit = {
  input: {
    infusedAlloy: 2,
    basicControlCircuit: 1,
  },
  output: 1,
};
const basicControlCircuit = {
  input: { osmium: 1 },
  output: 1,
};
const reinforcedAlloy = {
  input: { infusedAlloy: 1 },
  output: 1,
};
const infusedAlloy = {
  input: { iron: 1 },
  output: 1,
};
const steel = {
  input: { iron: 1 },
  output: 1,
};
const turbineCasing = {
  input: {
    steel: 4,
    osmium: 1,
  },
  output: 4,
  labels: ['industrialTurbine'],
};
const turbineValve = {
  input: {
    turbineCasing: 4,
    advancedControlCircuit: 1,
  },
  output: 2,
  labels: ['industrialTurbine'],
};
const turbineVent = {
  input: {
    turbineCasing: 4,
    bars: 1,
  },
  output: 2,
  labels: ['industrialTurbine'],
};
const turbineRotor = {
  input: {
    steel: 6,
    infusedAlloy: 3,
  },
  output: 1,
  labels: ['industrialTurbine'],
};
const turbineBlade = {
  input: {
    steel: 4,
    infusedAlloy: 1,
  },
  output: 1,
  labels: ['industrialTurbine'],
};
const rotationalComplex = {
  input: {
    infusedAlloy: 3,
    steel: 4,
    advancedControlCircuit: 2,
  },
  output: 1,
  labels: ['industrialTurbine'],
};
const pressureDispenser = {
  input: {
    steel: 4,
    bars: 4,
    infusedAlloy: 1,
  },
  output: 1,
  labels: ['industrialTurbine'],
};
const electromagneticCoil = {
  input: {
    steel: 4,
    gold: 4,
    energyTablet: 1,
  },
  output: 1,
  labels: ['industrialTurbine'],
};
const structuralGlass = {
  input: {
    steel: 4,
    glass: 1,
  },
  output: 4,
  labels: ['industrialTurbine'],
};
const energyTablet = {
  input: {
    gold: 3,
    infusedAlloy: 2,
    redstone: 4,
  },
  output: 1,
};
const inductionCasing = {
  input: {
    steel: 4,
    energyTablet: 1,
  },
  output: 4,
  labels: ['inductionMatrix'],
};
const inductionPort = {
  input: {
    inductionCasing: 4,
    eliteControlCircuit: 1,
  },
  output: 2,
  labels: ['inductionMatrix'],
};
const basicInductionCell = {
  input: {
    energyTablet: 4,
    lithium: 4,
    basicEnergyCube: 1,
  },
  output: 1,
  labels: ['inductionMatrix'],
};
const basicEnergyCube = {
  input: {
    energyTablet: 2,
    iron: 2,
    redstone: 4,
    steelCasing: 1,
  },
  output: 1,
};
const basicInductionProvider = {
  input: {
    lithium: 4,
    basicControlCircuit: 4,
    basicEnergyCube: 1,
  },
  output: 1,
  labels: ['inductionMatrix'],
};
export default Object.entries(
  {
    steelCasing,
    fissionCasing,
    fissionReactorPort,
    fissionLogicAdapter,
    fissionFuelAssembly,
    basicChemicalTank,
    controlRodAssembly,
    reactorGlass,
    eliteControlCircuit,
    advancedControlCircuit,
    infusedAlloy,
    basicControlCircuit,
    reinforcedAlloy,
    steel,
    turbineCasing,
    turbineBlade,
    turbineRotor,
    turbineValve,
    turbineVent,
    pressureDispenser,
    electromagneticCoil,
    rotationalComplex,
    structuralGlass,
    energyTablet,
    inductionCasing,
    inductionPort,
    basicInductionCell,
    basicEnergyCube,
    basicInductionProvider,
  },
).reduce((prev, [key, value]) => ({
  ...prev,
  [key]: {
    ...value,
    labels: 'labels' in value
      ? [...value.labels, 'minecraft']
      : ['minecraft'],
  },
}), {});
