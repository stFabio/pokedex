import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent {
  @Input() pokemon: Pokemon | null = null;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onOverlayClick() {
    this.close.emit();
  }

  formatId(id: number): string {
    return id.toString().padStart(3, '0');
  }

  formatHeight(height: number): string {
    return (height / 10).toFixed(1);
  }

  formatWeight(weight: number): string {
    return (weight / 10).toFixed(1);
  }
}
