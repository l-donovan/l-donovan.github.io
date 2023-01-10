import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowContentService {
  constructor(private http: HttpClient) { }

  getContent(name: string): Observable<string> {
    return this.http.get("/assets/html/" + name + ".html", {responseType: "text"});
  }
}
