import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Pokemon } from '../models/pokemon.model';


interface PokemonListResponse {
  pokemons: Pokemon[];
  total: number;
  hasMore: boolean;
  offset: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly apiUrl = "http://localhost:3000/api"

  constructor(private http: HttpClient) { }

  async loadPokemonBatch(offset: number): Promise<{
    pokemons: Pokemon[];
    hasMore: boolean;
  }> {
    const response = await firstValueFrom(
      this.http.get<PokemonListResponse>(
        `${this.apiUrl}/pokemon?limit=20&offset=${offset}`
      )
    );

    return {
      pokemons: response.pokemons,
      hasMore: response.hasMore
    };
  }

  async getPokemonById(id: number): Promise<Pokemon> {
    return firstValueFrom(
      this.http.get<Pokemon>(`${this.apiUrl}/pokemon/${id}`)
    );
  }

  async searchPokemonByName(name: string): Promise<Pokemon[]> {
    return firstValueFrom(
      this.http.get<Pokemon[]>(
        `${this.apiUrl}/pokemon/search?name=${name}`
      )
    );
  }
}
