import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface EventDTO {
  id?: number;
  description: string;
  startDate: string;
  endDate: string;
  eventType: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private apiUrl = 'http://localhost:8080/events';

  constructor(private http: HttpClient) { }

  getEvents(instructorId : number): Observable<EventDTO[]> {
    return this.http.get<EventDTO[]>(this.apiUrl+"/"+instructorId)
  }

  addEvent(event: EventDTO, instructorId: number) {
    return this.http.post(this.apiUrl+"/"+instructorId, event)
  }

  updateEvent(event: EventDTO, instructorId: number){
    return this.http.put(this.apiUrl+"/"+instructorId, event)
  }
 
  deleteEvent(eventId: number, instructorId: number){
    console.log("deleting2");
    return this.http.delete(this.apiUrl+"/"+instructorId+"/"+eventId);
  }
 
}
