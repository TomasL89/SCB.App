// export class FirmwareInfo {
//     public versions: Array<Version>;
// }

export class Version {
    version: string;
    releaseDate: string;
    uri: string;
    features: Array<string>;
    bugFixes: Array<string>;

    constructor(version: string, releaseDate: string, uri: string, features:Array<string>, bugFixes:Array<string>) {
        this.version = version;
        this.releaseDate = releaseDate;
        this.uri = uri;
        this.features = features;
        this.bugFixes = bugFixes;
    }
}
