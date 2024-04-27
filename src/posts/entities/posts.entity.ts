import { IsString } from "class-validator";
import { BaseModel } from "src/common/entity/base.entity";
import { stringValidationMessage } from "src/common/validation-message/string-validation-message";
import { UsersModel } from "src/users/entities/users.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class PostsModel extends BaseModel {
    // 1) UsersModel과 연동 FK를 이용해서
    // 2) null이 될 수 없다.
    @ManyToOne(() => UsersModel, (user) => user.posts, {
        nullable: false,
    })
    author: UsersModel;
    // @Column()
    // author: string;

    @Column()
    @IsString({
        message: stringValidationMessage,
    })
    title: string;

    @Column()
    @IsString({
        message: stringValidationMessage,
    })
    content: string;

    // 이미지 필수가 아니게
    @Column({
        nullable: true,
    })
    image?: string;

    @Column()
    likeCount: number;

    @Column()
    commentCount: number;
}