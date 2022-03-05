export class WiFiCredential {
    ssid: string;
    password: string;

    constructor(ssid: string, password: string) {
        this.ssid = ssid;
        this.password = password;
    }
}