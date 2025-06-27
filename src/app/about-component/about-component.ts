import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-about-component',
  imports: [CommonModule],
  templateUrl: './about-component.html',
  styleUrl: './about-component.css'
})
export class AboutComponent implements OnInit{
  utente:string|null = null;
  
  
  constructor(private route: ActivatedRoute) {}

  ngOnInit() 
  {
    this.utente = this.route.snapshot.paramMap.get('utente');
  }

}
