import { Injectable } from '@angular/core';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

@Injectable({
  providedIn: 'root'
})
export class AzureStorageService {

  private containerName = 'scb-fw-info';

  constructor() { }

  // todo rename this
  public async listFwVersions(): Promise<string[]> {
    let result: string[] = []

    // todo change to observable when working
    let blobs = this.containerClient().listBlobsFlat();
    for await (const blob of blobs) {
      result.push(blob.name);
    }

    return result;
  }

  // todo rename to something more generic
  public downloadFwVersion(name: string, handler: (blob: Blob) => void) {
    const blobClient = this.containerClient().getBlobClient(name);
    blobClient.download().then(response => {
      response.blobBody.then(blob => {
        handler(blob);
      })
    })
  }

  private containerClient(): ContainerClient {
    return new BlobServiceClient('https://scbfw.blob.core.windows.net')
      .getContainerClient(this.containerName);
  }
}
// https://scbfw.blob.core.windows.net/scb-fw-info/scb-fw-info.json