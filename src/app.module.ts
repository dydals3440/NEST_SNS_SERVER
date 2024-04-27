import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PostsModule } from "./posts/posts.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostsModel } from "./posts/entities/posts.entity";
import { UsersModule } from "./users/users.module";
import { UsersModel } from "./users/entities/users.entity";
import { AuthModule } from "./auth/auth.module";
import { CommonModule } from "./common/common.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import {
    ENV_DB_DATABASE_KEY,
    ENV_DB_HOST_KEY,
    ENV_DB_PASSWORD_KEY,
    ENV_DB_PORT_KEY,
    ENV_DB_USERNAME_KEY,
} from "./common/const/env-keys.const";

@Module({
    // 다른 모듈을 불러올 떄 사용
    imports: [
        PostsModule,
        ConfigModule.forRoot({
            envFilePath: ".env",
            // module 이기떄문에 쓸려는 모든 곳에서 import를 넣어줘야함.
            // 그래야 특정 모듈 정보를 쓸 수 있음. isGlobal: true는 Appmodule에 한번만 해도 모두 사용 가능!
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            // database 타입
            type: "postgres",
            host: process.env[ENV_DB_HOST_KEY],
            // 포트는 무조건 숫자
            port: parseInt(process.env[ENV_DB_PORT_KEY]),
            username: process.env[ENV_DB_USERNAME_KEY],
            password: process.env[ENV_DB_PASSWORD_KEY],
            database: process.env[ENV_DB_DATABASE_KEY],
            entities: [PostsModel, UsersModel],
            // nestjs에서 작성하는 typeorm코드와 DB 싱크를 자동으로 맞출꺼나.(개발환경에서는 true / production 환경에서는 마음대로 바뀔 수 있기에 false로 자동싱크맞추기 안하게)
            synchronize: true,
        }),
        UsersModule,
        AuthModule,
        CommonModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor,
        },
    ],
})
export class AppModule {}