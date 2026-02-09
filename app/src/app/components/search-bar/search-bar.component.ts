import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  @Output() searchChange = new EventEmitter<string>();
  
  searchQuery: string = '';

  onSearchChange() {
    this.searchChange.emit(this.searchQuery);
  }
}
