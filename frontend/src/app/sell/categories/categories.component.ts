import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from '../../footer/footer.component';
import { NavComponent } from '../../nav/nav.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Category {
  name: string;
  subcategories: string[];
  expanded?: boolean;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [FooterComponent, NavComponent, FormsModule, CommonModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {
  constructor(private router: Router) {}

  categories: Category[] = [
    { name: 'Electronics', subcategories: [], expanded: true },
    { name: 'Fashion', subcategories: [], expanded: false },
    { name: 'Home and Garden', subcategories: [], expanded: false },
    { name: 'Supermarket', subcategories: [], expanded: false },
    { name: 'Beauty', subcategories: [], expanded: false },
    { name: 'Culture', subcategories: [], expanded: false },
    { name: 'Sports and tourism', subcategories: [], expanded: false },
    { name: 'Automotive', subcategories: [], expanded: false },
    { name: 'Properties', subcategories: [], expanded: false },
  ];

  selectedCategories: { [key: string]: boolean } = {
    'Smartphones': false,
    'Smartwatches': false,
    'Tablets': false,
    'accessories GSM': false,
    'Cases and covers': false,
    'Headphones': false,
    'Laptops': false,
    'Computer': false,
    'TVs': false,
    'Projectors': false,
    'Home cinema': false,
    'Printers and scanners': false,
    'Men': false,
    'Women': false,
    'Kids': false,
    'Fashion Accessories': false,
    'Festival Specials': false,
    'Sunglasses': false,
    'Furniture': false,
    'Home Improvement': false,
    'Office Furniture': false,
    'Lighting': false,
    'Plants & Seeds': false,
    'Smart Home ': false,
    'Skincare': false,
    'Makeup': false,
    'Haircare': false,
    'Bath & Body': false,
    'Fragrances': false,
    'Natural & Organic': false,
    'Vehicle Parts': false,
    'Vehicle Accessories': false,
    'Car Electronics': false,
    'Motorcycle Gear': false,
    'Tires & Wheels': false,
    'Oils & Fluids': false,
    'ActiveWear': false,
    'FootWear': false,
    'Gym Equipment': false,
    'Adventure Sports': false,
    'Racquet Sports': false,
    'Sports Nutrition ': false,
    'Folk Art': false,
    'Clothing': false,
    'Instruments': false,
    'Books': false,
    'Artifacts': false,
    'Music': false,
  };

  toggleCategory(category: Category) {
    this.categories.forEach(cat => {
      if (cat !== category) {
        cat.expanded = false;
      }
    });
    category.expanded = !category.expanded;
  }

  getSelectedCategoriesArray(): string[] {
    return Object.entries(this.selectedCategories)
      .filter(([_, selected]) => selected)
      .map(([category]) => category);
  }

  removeCategory(category: string) {
    this.selectedCategories[category] = false;
  }

  onNext() {
    console.log('Selected categories:', this.getSelectedCategoriesArray());
    this.router.navigate(['/sell/photos']); 
  }
}
