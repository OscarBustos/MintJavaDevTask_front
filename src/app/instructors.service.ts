import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';

export interface InstructorsDTO {
  id : number;
  firstName: string;
  lastName: string;
  birthday: string;
  eventsOverAllDuration: number;
}


@Injectable({
  providedIn: 'root'
})
export class InstructorsService {

  private apiUrl = 'http://localhost:8080/instructors';

  constructor(private http: HttpClient) { }


  getInstructors(): Observable<InstructorsDTO[]> {
    return this.http.get<InstructorsDTO[]>(this.apiUrl)
  }
}
