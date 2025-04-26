import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bazaar',
  imports: [NavComponent,FooterComponent,RouterModule],
  templateUrl: './bazaar.component.html',
  styleUrl: './bazaar.component.css'
})
export class BazaarComponent {
  openLocation(event: Event, bazaarName: string) {
    event.preventDefault();
    const locations = {
      'Americana': 'https://www.google.com/maps/place/%D8%A3%D9%85%D8%B1%D9%8A%D9%83%D8%A7%D9%86%D8%A7+%D8%A8%D9%84%D8%A7%D8%B2%D8%A7+-+%D8%B2%D8%A7%D9%8A%D8%AF%E2%80%AD/@30.0269193,31.0150556,17z/data=!4m14!1m7!3m6!1s0x14585a6a5fac05e3:0x2d871f3c2b02f918!2z2KPZhdix2YrZg9in2YbYpyDYqNmE2KfYstinIC0g2LLYp9mK2K8!8m2!3d30.0275138!4d31.0132317!16s%2Fg%2F11gbgcp7_3!3m5!1s0x14585a6a5fac05e3:0x2d871f3c2b02f918!8m2!3d30.0275138!4d31.0132317!16s%2Fg%2F11gbgcp7_3?entry=ttu&g_ep=EgoyMDI1MDQyMy4wIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D',
      'shopping': 'https://www.google.com/maps/place/%D8%A7%D9%84%D8%A8%D9%88%D8%A7%D8%A8%D9%87+%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%D9%87%E2%80%AD/@29.9806357,30.9503253,18.86z/data=!4m14!1m7!3m6!1s0x145856fda307cdaf:0xe0963aeb7fc1b547!2z2YbYp9iv2Yog2YXYr9mK2YbYqSDZpiDYo9mD2KrZiNio2LEg2KfZhNix2YrYp9i22Yo!8m2!3d29.9809792!4d30.9506253!16s%2Fg%2F119vcnf9h!3m5!1s0x1458576b5a631043:0x7c68e6d403186a16!8m2!3d29.9808785!4d30.9508178!16s%2Fg%2F11nfm8q7mf?entry=ttu&g_ep=EgoyMDI1MDQyMy4wIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D',
      'portsaid': 'https://www.google.com/maps?q=31.265297,32.301892'
    };
    window.open(locations[bazaarName as keyof typeof locations], '_blank');
  }
}
