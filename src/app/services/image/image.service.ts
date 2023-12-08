import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }
  getImageByName(imageName: string) {
    return this.http.get(`${env.apiUrl}/image/${imageName}`, { responseType: 'blob' });
  }
  getImageURLByName(imageName: string): Observable<{ message: string, data: any }> {
    return this.http.get<{ message: string, data: any }>(`${env.apiUrl}/image/imageUrl/${imageName}`);
  }
  uploadImages(images: FileList, tag: string) {
    const formData: FormData = new FormData();
    formData.append("tag", tag);
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }
    return this.http.post(`${env.apiUrl}/image/multiple`, formData);
  }
}
