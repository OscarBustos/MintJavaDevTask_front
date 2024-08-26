import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InstructorsComponent } from "./instructors/instructors.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InstructorsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'MintJavaDevTask';

  
}
