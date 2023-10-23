import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }
  getImageByName(imageName: string) {
    return this.http.get(`${env.apiUrl}/image/${imageName}`, { responseType: 'blob' });
  }
}
