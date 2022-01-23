export class DataPayload {
  cycleTime: number;
  boilerTemp: number;
  pumpPressure: number;
  steamTemp: number;

  constructor(
    cycleTime: number,
    boilerTemp: number,
    pumpPressure: number,
    steamTemp: number) {
      this.cycleTime = cycleTime;
      this.boilerTemp = boilerTemp;
      this.pumpPressure = pumpPressure;
      this.steamTemp = steamTemp;
    }
// todo later
    private convertStageFromNumber(cycleStage: number): string {
      switch (cycleStage) {
        case 1:
          return "Warming Up";
        case 2:
          return "Pre-Infusion";
        case 3:
          return "Shot";
        case 4:
          return "Steam";
        default:
          return "Unknown";
      }
    }
}
