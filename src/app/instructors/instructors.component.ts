import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructorsDTO, InstructorsService } from '../instructors.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instructors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instructors.component.html',
  styleUrl: './instructors.component.css'
})
export class InstructorsComponent implements OnInit {

  constructor(private instructorsService: InstructorsService, private router: Router){

  }
  
  instructors!: InstructorsDTO[] ;

  ngOnInit() {
    this.instructorsService.getInstructors().subscribe( (value: any) => this.instructors = value);  
  }

  showEvents(instructorId: number){
    this.router.navigate(["/events/"+instructorId]);
  }
}
