import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarFormValue, ListPredictionResponse, Prediction, PredictionResult } from '../models/car';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private apiUrl = environment.apiBaseUrl

  constructor(private http: HttpClient, private auth: AuthService) { }

  predict(v: CarFormValue): Observable<PredictionResult> {
    return this.http.post<PredictionResult>(`${this.apiUrl}/prediction`, v);
  }

  getPredictions(email: string, page: number, filterClass?: string): Observable<ListPredictionResponse> {
    let params = new HttpParams()
      .set('email', email)
      .set('page', page.toString());

    if (filterClass) {
      params = params.set('class', filterClass);
    }

    return this.http.get<ListPredictionResponse>(`${this.apiUrl}/get_user_predictions`, { params });
  }

  addUser(email: string, name: string): Observable<any>{
    const body = { name, email };
    return this.http.post(`${this.apiUrl}/add_user`, body, {headers: { 'Content-Type': 'application/json' }, responseType: 'text'})
  }

  addPrediction(p: Prediction): Observable<any>{
    return this.http.post(`${this.apiUrl}/add_prediction`, p, {responseType: 'text'})
  }


  deletePrediction(id: number | null): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete_prediction?id=${id}`, {responseType: 'text'});
  }

  isModel(): Observable<any> {
    return this.http.get(`${this.apiUrl}/isModel`, {responseType: 'text'});
  }
}
