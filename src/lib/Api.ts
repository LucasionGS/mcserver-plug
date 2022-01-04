import request from "request";
import util from "./IonUtil";
import * as fs from "fs";
import { Download } from "./Download";
import { Server } from "..";

namespace Api {
  const queryUrl = "https://launchermeta.mojang.com/mc/game/version_manifest.json";

  interface VersionResponse {
    latest: {
      snapshot: string;
      release: string;
    }
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
      "id": string,
      "sha1": string,
      "size": number,
      "totalSize": number,
      "url": string,
    },
    "assets": string,
    "complianceLevel": number,
    "downloads": {
      "client": {
        "sha1": string,
        "size": number,
        "url": string,
      },
      "client_mappings": {
        "sha1": string,
        "size": number,
        "url": string,
      },
      "server": {
        "sha1": string,
        "size": number,
        "url": string,
      },
      "server_mappings": {
        "sha1": string,
        "size": number,
        "url": string,
      }
    },
    "id": string,
    "logging": {
      "client": {
        "argument": string,
        "file": {
          "id": string,
          "sha1": string,
          "size": number,
          "url": string
        },
        "type": string
      }
    },
    "mainClass": string,
    "minimumLauncherVersion": number,
    "releaseTime": string,
    "time": string,
    "type": string
  }

  export async function getVersions() {
    let p = util.promise<VersionResponse>();
    request(queryUrl, {
      json: true
    }, (err, _, data: VersionResponse) => {
      if (err) console.error(err);
      p.resolve(data);
    });

    return p.promise;
  }

  export async function getRelease(version: Version | Promise<Version> | string) {
    if (typeof version == "string") {
      version = getVersions().then(v => v.versions.find(v => v.id == version));
    }
    version = await version;
    let p = util.promise<Release>();
    request(version.url, {
      json: true
    }, (err, _, data: Release) => {
      if (err) console.error(err);
      p.resolve(data);
    });

    return p.promise;
  }

  export async function downloadServer(release: Release | Promise<Release>, location: string, jarName = "server", serverType: ServerType = "vanilla") {
    release = await release;

    if (jarName.endsWith(".jar")) jarName = jarName.substring(0, jarName.length - 4);

    fs.mkdirSync(location, { recursive: true });
    let dl: Download;
    switch (serverType) {
      case "bukkit":
        let url = `https://download.getbukkit.org/craftbukkit/craftbukkit-${release.id}.jar`
        dl = new Download(url, location + `/${jarName}.jar`);
        break;

      default:
        dl = new Download(release.downloads.server.url, location + `/${jarName}.jar`);
        break;
    }
    return dl;
  }

  export type ServerType = "vanilla" | "bukkit";
}

export default Api;