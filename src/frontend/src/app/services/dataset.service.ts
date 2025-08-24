import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dataset } from '../models/dataset';
import { environment } from 'src/environment';



@Injectable({
  providedIn: 'root'
})


export class DatasetService {
  private apiUrl = environment.apiBaseUrl

  constructor(private http: HttpClient) {}

  
  getDatasetMetadata(): Observable<Dataset> {
    return this.http.get<Dataset>(`${this.apiUrl}/get_metadata`);
  }


  uploadDataset(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload_dataset`, formData, {responseType: 'text'});
  }
}
