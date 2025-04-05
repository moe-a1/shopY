import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SellComponent } from './sell/sell.component';
import { BazaarComponent } from './bazaar/bazaar.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'home', component: HomeComponent },
    { path: 'sell', component: SellComponent },
    { path: 'bazaar', component: BazaarComponent },
];

