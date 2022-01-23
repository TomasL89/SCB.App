export class BoilerPIDTuningDataPayload {
  cycleTime: number;
  boilerTemp: number;
  boilerTarget: number;
  dimmerPower: number;
  PIDKp: number;
  PIDKi: number;
  PIDKd: number;

  constructor(
    cycleTime: number,
    boilerTemp: number,
    boilerTarget: number,
    dimmerPower: number,
    PIDKp: number,
    PIDKi: number,
    PIDKd: number) {
      this.cycleTime = cycleTime;
      this.boilerTemp = boilerTemp;
      this.boilerTarget = boilerTarget;
      this.dimmerPower = dimmerPower;
      this.PIDKp = PIDKp;
      this.PIDKi = PIDKi;
      this.PIDKd = PIDKd;
  }
}
