import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.css']
})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;
  @Input() isSelected: boolean = false;
  @Output() cardClick = new EventEmitter<Pokemon>();

  onCardClick() {
    this.cardClick.emit(this.pokemon);
  }

  formatId(id: number): string {
    return id.toString().padStart(3, '0');
  }
}
