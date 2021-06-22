export class Profile {
  name: string;
  boilerTemperature: number;
  pumpPressure: number;
  preInfusionTime: number;
  shotTime: number;

  constructor(
    name: string,
    boilerTemperature: number,
    pumpPressure: number,
    preInfusionTime: number,
    shotTime: number
  ) {
    this.name = name;
    this.boilerTemperature = boilerTemperature;
    this.pumpPressure = pumpPressure;
    this.preInfusionTime = preInfusionTime;
    this.shotTime = shotTime;
  }
}
