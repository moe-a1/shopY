import { Component } from '@angular/core';
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
    'Laptops': false,
    'Laptop components': false,  // Pre-selected in the image
    'Desktop Computers': false,  // Pre-selected in the image
    'Computer components': false,
    'Printers and scanners': false,
    'TVs': false,
    'Projectors': false,
    'Headphones': false,
    'Audio for home': false,
    'Home cinema': false,
    'Console PlayStation 5': false,
    'Console Xbox Series X/S': false,
    'Console PlayStation 4': false,
    'Console Xbox One': false,
    'Console Nintendo Switch': false
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
    // Navigate to the next step (Photos) here
  }
}