export interface Pokemon {
  name: string;
  url: string;
  id: number;
  imageUrl: string;
  types?: string[];
  height?: number;
  weight?: number;
}

export interface PokemonApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
}

export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { type: { name: string } }[];
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
}
