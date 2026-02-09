import {
  Controller,
  Get,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonDto, PokemonListResponseDto } from './dto/pokemon.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPokemonList(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<PokemonListResponseDto> {
    const parsedLimit = limit ? Number(limit) : 20;
    const parsedOffset = offset ? Number(offset) : 0;

    return this.pokemonService.getPokemonList(parsedLimit, parsedOffset);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async searchPokemon(@Query('name') name: string): Promise<PokemonDto[]> {
    return this.pokemonService.searchPokemonByName(name);
  }

  @Get(':idOrName')
  @HttpCode(HttpStatus.OK)
  async getPokemonByIdOrName(
    @Param('idOrName') idOrName: string,
  ): Promise<PokemonDto> {
    return this.pokemonService.getPokemonByIdOrName(idOrName);
  }

  @Delete('cache')
  @HttpCode(HttpStatus.NO_CONTENT)
  clearCache(): void {
    this.pokemonService.clearCache();
  }
}
