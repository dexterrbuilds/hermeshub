import { Controller, Get, Param } from "@nestjs/common";
import { ServicesService } from "./services.service";

@Controller("services")
export class ServicesController {
  constructor(private readonly services: ServicesService) {}

  @Get(":id")
  detail(@Param("id") id: string) {
    return this.services.detail(id);
  }
}
