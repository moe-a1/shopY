import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ParticlesService } from '../services/particles.service';

@Component({
  selector: 'app-landing-page',
  imports: [RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  @ViewChild('particlesContainer') particlesContainer!: ElementRef<HTMLDivElement>;

  constructor(private particlesService: ParticlesService) {}

  ngAfterViewInit(): void {
    this.particlesService.initialize(this.particlesContainer.nativeElement);
  }

  ngOnDestroy(): void {
    this.particlesService.dispose();
  }
}
