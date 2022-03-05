export class BoardSettingsDataPayload {
    firmwareVersion: string;
    wiFiConnected: boolean;

    constructor(
        firmwareVersion: string,
        wiFiConnected: number
    ) {
        this.firmwareVersion = firmwareVersion;
        this.wiFiConnected = wiFiConnected == 1 ? true : false;
    }
}