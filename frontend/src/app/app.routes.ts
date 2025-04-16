import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SellComponent } from './sell/sell.component';
import { BazaarComponent } from './bazaar/bazaar.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DescriptionComponent } from './sell/description/description.component';
import { CategoriesComponent } from './sell/categories/categories.component';
import { PhotosComponent } from './sell/photos/photos.component';
import { YourProductsComponent } from './sell/your-products/your-products.component';
import { ProductsComponent } from './products/products.component';
import { CartComponent } from './cart/cart.component';
import { CategoryComponent } from './category/category.component';
import { ProductPageComponent } from './product-page/product-page.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'home', component: HomeComponent },
    { path: 'sell', component: SellComponent },
    { path: 'bazaar', component: BazaarComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'sell/description', component: DescriptionComponent },
    { path: 'sell/categories', component: CategoriesComponent },
    { path: 'sell/photos', component: PhotosComponent },
    { path: 'sell/userProducts', component: YourProductsComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'cart', component: CartComponent },
    { path: 'category/:categoryName', component: CategoryComponent },
    { path: 'ProductPage', component: ProductPageComponent },
];

