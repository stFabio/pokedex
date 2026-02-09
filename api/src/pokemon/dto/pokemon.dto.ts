export interface PokemonDto {
  name: string;
  url: string;
  id: number;
  imageUrl: string;
  types?: string[];
  height?: number;
  weight?: number;
}

export interface PokemonListResponseDto {
  pokemons: PokemonDto[];
  total: number;
  hasMore: boolean;
  offset: number;
  limit: number;
}

export interface PokemonQueryDto {
  limit?: number;
  offset?: number;
}
