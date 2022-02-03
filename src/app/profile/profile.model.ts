export class Profile {
  id: string;
  name: string;
  boilerTemperature: number;
  pumpPressure: number;
  preinfusionPressure: number;
  preInfusionTime: number;
  shotTime: number;
  selected: boolean;

  constructor(
    id: string,
    name: string,
    boilerTemperature: number,
    pumpPressure: number,
    preinfusionPressure: number,
    preInfusionTime: number,
    shotTime: number,
    selected: boolean
  ) {
    this.id = id;
    this.name = name;
    this.boilerTemperature = boilerTemperature;
    this.pumpPressure = pumpPressure;
    this.preinfusionPressure = preinfusionPressure;
    this.preInfusionTime = preInfusionTime;
    this.shotTime = shotTime;
    this.selected = selected;
  }
}
