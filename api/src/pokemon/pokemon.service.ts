import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PokemonDto, PokemonListResponseDto } from './dto/pokemon.dto';
import {
  PokeApiResponse,
  PokeApiPokemonDetails,
} from './interfaces/pokeapi.interface';

@Injectable()
export class PokemonService {
  private readonly logger = new Logger(PokemonService.name);
  private readonly pokeApiUrl = 'https://pokeapi.co/api/v2/pokemon';
  private readonly cache = new Map<string, any>();
  private readonly cacheTTL = 3600000; // 1 hour in milliseconds

  constructor(private readonly httpService: HttpService) {}

  async getPokemonList(
    limit: number = 20,
    offset: number = 0,
  ): Promise<PokemonListResponseDto> {
    try {
      this.logger.log(`Fetching Pokemon list: limit=${limit}, offset=${offset}`);

      // Check cache first
      const cacheKey = `list_${limit}_${offset}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        this.logger.log('Returning cached Pokemon list');
        return cached;
      }

      // Fetch from PokeAPI
      const { data } = await firstValueFrom(
        this.httpService.get<PokeApiResponse>(
          `${this.pokeApiUrl}?limit=${limit}&offset=${offset}`,
        ),
      );

      // Fetch details for each Pokemon in parallel
      const pokemonPromises = data.results.map((pokemon) =>
        this.getPokemonDetails(pokemon.url),
      );
      const pokemons = await Promise.all(pokemonPromises);

      const response: PokemonListResponseDto = {
        pokemons,
        total: data.count,
        hasMore: data.next !== null,
        offset,
        limit,
      };

      // Cache the response
      this.setCache(cacheKey, response);

      return response;
    } catch (error) {
      this.logger.error('Error fetching Pokemon list', error);
      throw new HttpException(
        'Failed to fetch Pokemon list',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPokemonByIdOrName(idOrName: string | number): Promise<PokemonDto> {
    try {
      this.logger.log(`Fetching Pokemon: ${idOrName}`);

      // Check cache first
      const cacheKey = `pokemon_${idOrName}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        this.logger.log('Returning cached Pokemon');
        return cached;
      }

      const url = `${this.pokeApiUrl}/${idOrName}`;
      const pokemon = await this.getPokemonDetails(url);

      // Cache the response
      this.setCache(cacheKey, pokemon);

      return pokemon;
    } catch (error) {
      this.logger.error(`Error fetching Pokemon ${idOrName}`, error);
      throw new HttpException(
        `Pokemon ${idOrName} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async searchPokemonByName(name: string): Promise<PokemonDto[]> {
    try {
      this.logger.log(`Searching Pokemon by name: ${name}`);

      // For simplicity, we'll fetch the first 1000 Pokemon and filter
      // In production, you might want to implement a proper search index
      const { data } = await firstValueFrom(
        this.httpService.get<PokeApiResponse>(
          `${this.pokeApiUrl}?limit=1000&offset=0`,
        ),
      );

      const searchTerm = name.toLowerCase();
      const filteredResults = data.results.filter((pokemon) =>
        pokemon.name.includes(searchTerm),
      );

      // Limit results to first 20 matches
      const limitedResults = filteredResults.slice(0, 20);

      const pokemonPromises = limitedResults.map((pokemon) =>
        this.getPokemonDetails(pokemon.url),
      );

      return await Promise.all(pokemonPromises);
    } catch (error) {
      this.logger.error('Error searching Pokemon', error);
      throw new HttpException(
        'Failed to search Pokemon',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getPokemonDetails(url: string): Promise<PokemonDto> {
    const { data } = await firstValueFrom(
      this.httpService.get<PokeApiPokemonDetails>(url),
    );

    return {
      name: data.name,
      url: url,
      id: data.id,
      imageUrl: data.sprites.other['official-artwork'].front_default,
      types: data.types.map((t) => t.type.name),
      height: data.height,
      weight: data.weight,
    };
  }

  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  // Clear cache (useful for admin endpoints)
  clearCache(): void {
    this.logger.log('Clearing Pokemon cache');
    this.cache.clear();
  }
}
