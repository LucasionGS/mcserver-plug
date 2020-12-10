import { Network } from "ionew";
declare namespace Api {
    interface VersionResponse {
        latest: {
            snapshot: string;
            release: string;
        };
        versions: Version[];
    }
    interface Version {
        id: string;
        type: "snapshot" | "release" | "old_beta" | "old_alpha";
        url: string;
        time: string;
        releaseTime: string;
    }
    interface Release {
        "assetIndex": {
            "id": string;
            "sha1": string;
            "size": number;
            "totalSize": number;
            "url": string;
        };
        "assets": string;
        "complianceLevel": number;
        "downloads": {
            "client": {
                "sha1": string;
                "size": number;
                "url": string;
            };
            "client_mappings": {
                "sha1": string;
                "size": number;
                "url": string;
            };
            "server": {
                "sha1": string;
                "size": number;
                "url": string;
            };
            "server_mappings": {
                "sha1": string;
                "size": number;
                "url": string;
            };
        };
        "id": "1.16.4";
        "logging": {
            "client": {
                "argument": string;
                "file": {
                    "id": string;
                    "sha1": string;
                    "size": number;
                    "url": string;
                };
                "type": string;
            };
        };
        "mainClass": string;
        "minimumLauncherVersion": number;
        "releaseTime": string;
        "time": string;
        "type": string;
    }
    export function getVersions(): Promise<VersionResponse>;
    export function getRelease(version: Version | Promise<Version> | string): Promise<Release>;
    export function downloadServer(release: Release | Promise<Release>, location: string): Promise<Network.Download>;
    export {};
}
export default Api;
