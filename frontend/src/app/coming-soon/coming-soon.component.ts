import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-coming-soon',
  imports: [FooterComponent,NavComponent],
  templateUrl: './coming-soon.component.html',
  styleUrl: './coming-soon.component.css'
})
export class ComingSoonComponent { 
  openLocation(event: Event, bazaarName: string) {
    event.preventDefault();
    const locations = {
      'october': 'https://www.google.com/maps/place/%D9%86%D8%A7%D8%AF%D9%8A+%D9%85%D8%AF%D9%8A%D9%86%D8%A9+%D9%A6+%D8%A3%D9%83%D8%AA%D9%88%D8%A8%D8%B1+%D8%A7%D9%84%D8%B1%D9%8A%D8%A7%D8%B6%D9%8A%E2%80%AD/@29.9811224,30.9572955,17z/data=!4m12!1m5!3m4!2zMjnCsDU4JzUyLjAiTiAzMMKwNTcnMTguNCJF!8m2!3d29.9811224!4d30.9551068!3m5!1s0x145856fda307cdaf:0xe0963aeb7fc1b547!8m2!3d29.9809792!4d30.9506253!16s%2Fg%2F119vcnf9h?entry=ttu&g_ep=EgoyMDI1MDQyMy4wIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D',
      'ataba': 'https://www.google.com/maps?q=30.053355,31.248662',
      'portsaid': 'https://www.google.com/maps?q=31.265297,32.301892'
    };
    window.open(locations[bazaarName as keyof typeof locations], '_blank');
  }
}
