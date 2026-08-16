import { Controller, Get, Param, Query } from "@nestjs/common";
import { NearbyBusinessesDto } from "./dto/nearby-businesses.dto";
import { SearchBusinessesDto } from "./dto/search-businesses.dto";
import { BusinessesService } from "./businesses.service";

@Controller("businesses")
export class BusinessesController {
  constructor(private readonly businesses: BusinessesService) {}

  @Get("search")
  search(@Query() query: SearchBusinessesDto) {
    return this.businesses.search(query);
  }

  @Get("nearby")
  nearby(@Query() query: NearbyBusinessesDto) {
    return this.businesses.nearby(query);
  }

  @Get(":id")
  detail(@Param("id") id: string) {
    return this.businesses.detail(id);
  }
}
