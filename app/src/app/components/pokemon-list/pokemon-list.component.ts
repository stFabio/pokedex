import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { PokemonDetailComponent } from '../pokemon-detail/pokemon-detail.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    CommonModule,
    PokemonCardComponent,
    PokemonDetailComponent,
    SearchBarComponent
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {
  pokemonList: Pokemon[] = [];
  filteredPokemon: Pokemon[] = [];
  selectedPokemon: Pokemon | null = null;
  searchQuery: string = '';
  loading: boolean = false;
  loadingMore: boolean = false;
  hasMore: boolean = true;
  
  private offset: number = 0;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.loadPokemon();
  }

  async loadPokemon() {
    this.loading = true;
    
    try {
      const result = await this.pokemonService.loadPokemonBatch(this.offset);
      
      this.pokemonList = [...this.pokemonList, ...result.pokemons];
      this.filteredPokemon = [...this.pokemonList];
      this.offset += 20;
      this.hasMore = result.hasMore;
    } catch (error) {
      console.error('Error loading Pokémon:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadMore() {
    this.loadingMore = true;
    
    try {
      const result = await this.pokemonService.loadPokemonBatch(this.offset);
      
      this.pokemonList = [...this.pokemonList, ...result.pokemons];
      this.filteredPokemon = [...this.pokemonList];
      this.offset += 20;
      this.hasMore = result.hasMore;
    } catch (error) {
      console.error('Error loading more Pokémon:', error);
    } finally {
      this.loadingMore = false;
    }
  }

  onSearch(query: string) {
    this.searchQuery = query;
    
    if (!query.trim()) {
      this.filteredPokemon = [...this.pokemonList];
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    this.filteredPokemon = this.pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm)
    );
  }

  clearSearch() {
    this.searchQuery = '';
    this.filteredPokemon = [...this.pokemonList];
  }

  selectPokemon(pokemon: Pokemon) {
    this.selectedPokemon = pokemon;
  }

  closeDetail() {
    this.selectedPokemon = null;
  }
}
