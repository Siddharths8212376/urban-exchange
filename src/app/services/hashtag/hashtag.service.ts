import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HashTag } from 'src/app/models/hashtag.model';
import { env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HashtagService {

  constructor(private http: HttpClient) { }
  searchHashTag(searchTerm: string): Observable<{ message: string, data: HashTag[] }> {
    // removing the # from searchTerm (searchTerm.substring(1)) - as it would be taken as a url fragment
    return this.http.get<{ message: string, data: HashTag[] }>(`${env.apiUrl}/hashtag/search/${searchTerm.substring(1)}`);
  }
}
