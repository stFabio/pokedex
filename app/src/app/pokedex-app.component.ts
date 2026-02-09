import { Component } from '@angular/core';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';

@Component({
  selector: 'pokedex',
  standalone: true,
  imports: [PokemonListComponent],
  templateUrl: './pokedex-app.component.html',
  styleUrls: ['./pokedex-app.component.css']
})
export class AppComponent {
  title = 'Pokédex';
}
