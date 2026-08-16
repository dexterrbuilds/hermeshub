import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./auth/auth.module";
import { BookingsModule } from "./bookings/bookings.module";
import { BusinessesModule } from "./businesses/businesses.module";
import { CategoriesModule } from "./categories/categories.module";
import { DatabaseModule } from "./database/database.module";
import { FavoritesModule } from "./favorites/favorites.module";
import { ProfilesModule } from "./profiles/profiles.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { ServicesModule } from "./services/services.module";
import { SupabaseModule } from "./supabase/supabase.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 120 }]),
    DatabaseModule,
    SupabaseModule,
    AuthModule,
    ProfilesModule,
    CategoriesModule,
    BusinessesModule,
    BookingsModule,
    ReviewsModule,
    ServicesModule,
    FavoritesModule
  ]
})
export class AppModule {}
