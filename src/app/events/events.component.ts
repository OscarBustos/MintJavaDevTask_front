import { Component, ElementRef, ViewChild } from '@angular/core';
import { FullCalendarModule, FullCalendarComponent  } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventDTO, EventsService } from '../events.service';
import { ActivatedRoute } from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { formatDate } from '@angular/common';



@Component({
  selector: 'app-events',
  standalone: true,
  imports: [FullCalendarModule, ReactiveFormsModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent {
  
  constructor(private eventsService: EventsService, private router: ActivatedRoute){

  }
  
  public form!: FormGroup;
  public updateForm!: FormGroup;
  private instructorId! : number;
  private events!: EventDTO[];

  ngOnInit() {
    
    this.form = new FormGroup({
      title: new FormControl('',Validators.required),
      startDate: new FormControl('',Validators.required),
      endDate: new FormControl('',Validators.required),
      category: new FormControl('',Validators.required)
    });

    this.updateForm = new FormGroup({
      title: new FormControl('',Validators.required),
      startDate: new FormControl('',Validators.required),
      endDate: new FormControl('',Validators.required),
      category: new FormControl('',Validators.required)
    });


    this.instructorId = this.router.snapshot.params["id"];

    this.fetchEvents();
  }

fetchEvents(){
  this.eventsService.getEvents(this.instructorId).subscribe( (value) => {
    this.events = value; this.initEvents();
  });  
}

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    editable: true,
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay' // user can switch between the two
    },
    eventClick: (arg) => this.showInfo(arg),
    eventDrop: (arg) => {
      const newEventDTO: EventDTO = {
        id: Number(arg.event.id),
        description: arg.event.title,
        startDate: formatDate(String(arg.event.start), "yyyy-MM-ddThh:mm", "en-US", "+0500" ),
        endDate: formatDate(String(arg.event.end), "yyyy-MM-ddThh:mm", "en-US", "+0500" ),
        eventType: arg.event.groupId
      }
      console.log("updating",newEventDTO);
      this.callUpdateEVent(newEventDTO);
    }
    
    
  };

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  addEvent() {

    const newEventDTO: EventDTO = {
      description: this.form.get("title")!.value,
      startDate: this.form.get("startDate")!.value,
      endDate: this.form.get("endDate")!.value,
      eventType: this.form.get("category")!.value
    }
    console.log("adding",newEventDTO);
    this.eventsService.addEvent(newEventDTO, this.instructorId).subscribe( () => {
      let calendarApi = this.calendarComponent.getApi();
      calendarApi.removeAllEvents();
      this.fetchEvents();
    });
  }

  initEvents(){

    this.events.forEach((event) => {
      
      const newEvent: EventInput = {
        id: String(event.id),
        title: event.description,
        start: event.startDate,
        end: event.endDate,
        allDay: false,
        groupId: event.eventType
      };

      this.addEventToCalendar(
          newEvent
      )
    })
  }

  private addEventToCalendar(eventInput :EventInput){
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.addEvent(eventInput);
  }

  @ViewChild('eventInfo') eventInfoDialog!: ElementRef;

  showInfo(arg: any){

    this.updateForm= new FormGroup({
      id: new FormControl(arg.event.id),
      title: new FormControl(arg.event.title,Validators.required),
      startDate: new FormControl(formatDate(arg.event.start, "yyyy-MM-ddThh:mm", "en-US", "+0500" ),Validators.required),
      endDate: new FormControl(formatDate(arg.event.end, "yyyy-MM-ddThh:mm", "en-US", "+0500" ),Validators.required),
      category: new FormControl(arg.event.groupId,Validators.required)
    });
    this.eventInfoDialog.nativeElement.showModal();
  }

  updateEvent(){

    const newEventDTO: EventDTO = {
      id: this.updateForm.get("id")!.value,
      description: this.updateForm.get("title")!.value,
      startDate: this.updateForm.get("startDate")!.value,
      endDate: this.updateForm.get("endDate")!.value,
      eventType: this.updateForm.get("category")!.value
    }
    this.callUpdateEVent(newEventDTO);
  }

  callUpdateEVent(event: EventDTO){
    this.eventsService.updateEvent(event, this.instructorId).subscribe( () => {
      let calendarApi = this.calendarComponent.getApi();
      calendarApi.removeAllEvents();
      this.fetchEvents();
    });
    this.cancelUpdate();
  }

  cancelUpdate(){
    this.eventInfoDialog.nativeElement.close();
  }

  deleteEvent(){
    console.log("deleting");
    this.eventsService.deleteEvent(this.updateForm.get("id")!.value, this.instructorId).subscribe( () => {
      let calendarApi = this.calendarComponent.getApi();
      calendarApi.removeAllEvents();
      this.fetchEvents();
    });
    this.cancelUpdate();
  }
}
