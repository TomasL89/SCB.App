import { Injectable } from '@angular/core';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AzureStorageService {

  private containerName = 'scb-fw-info';

  constructor(private http: HttpClient) { }

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

public async downloadFw(name: string) {

    const response = await fetch(name);
    const bufferBlob = await response.blob();
    const formData = new FormData();
    formData.append('fw', bufferBlob);

    this.http.post('http://scb-board:81/update', formData).subscribe((response) => {
      console.log(`Response: ${response}`);
    }, (error) => {
      console.log(`Error: ${error}`);
    });
}

private containerClient(): ContainerClient {
  return new BlobServiceClient('https://scbfw.blob.core.windows.net')
    .getContainerClient(this.containerName);
}

async streamToText(readable) {
  readable.setEncoding('utf8');
  let data = '';
  for await(const chunk of readable) {
    data += chunk;
  }
  return data;
}
}
