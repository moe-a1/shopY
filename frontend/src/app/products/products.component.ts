import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  price: number;
  bids: number;
  seller: string;
  image: string;
}

@Component({
  selector: 'app-products',
  imports: [NavComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  products: Product[] = [
    {
      id: 1,
      name: 'Rolex watch',
      price: 3000,
      bids: 11,
      seller: 'John Doe',
      image: '/images/Frame 905.png'
    },
    {
      id: 2,
      name: 'Toothbrush',
      price: 200,
      bids: 2,
      seller: 'Jane Smith',
      image: '/images/Frame 905.png'
    },
    {
      id: 3,
      name: 'Shaving Machine',
      price: 950,
      bids: 7,
      seller: 'Mike Johnson',
      image: '/images/Frame 905.png'
    },
    {
      id: 4,
      name: 'Gaming Laptop',
      price: 6500,
      bids: 5,
      seller: 'Alice Carter',
      image: '/images/Frame 905.png'
    },
    {
      id: 5,
      name: 'Bluetooth Speaker',
      price: 750,
      bids: 9,
      seller: 'David Lee',
      image: '/images/Frame 905.png'
    },
    {
      id: 6,
      name: 'Smart Watch',
      price: 1200,
      bids: 4,
      seller: 'Emma Watson',
      image: '/images/Frame 905.png'
    }
  ]
  ;

  // Filter properties
  minPrice: number = 200;
  maxPrice: number = 4000;
  currentPriceRange: number = 200;
  
  // Sort properties
  sortOptions: string[] = ['Most Popular', 'Price: Low to High', 'Price: High to Low', 'Newest First'];
  selectedSort: string = 'Most Popular';
  
  // Filter methods
  applyFilter(): void {
    // Filter logic would go here
    console.log('Filtering with price range:', this.currentPriceRange);
  }
  
  // Sort methods
  sortProducts(option: string): void {
    this.selectedSort = option;
    
    switch(option) {
      case 'Price: Low to High':
        this.products.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        this.products.sort((a, b) => b.price - a.price);
        break;
      case 'Most Popular':
        this.products.sort((a, b) => b.bids - a.bids);
        break;
    }
  }
}