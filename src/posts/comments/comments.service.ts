import { DEFAULT_COMMENT_FIND_OPTIONS } from "./const/default-comment-find-option.const";
import { PaginateCommentsDto } from "./dto/paginate-comments.dto";
import { CommonService } from "src/common/common.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentsModel } from "./entity/comments.entity";
import { Repository } from "typeorm";
import { CreateCommentsDto } from "./dto/create-comments.dto";
import { UsersModel } from "src/users/entity/users.entity";

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentsModel)
        private readonly commentsRepository: Repository<CommentsModel>,
        private readonly CommonService: CommonService,
    ) {}

    paginateComments(dto: PaginateCommentsDto, postId: number) {
        return this.CommonService.paginate(
            dto,
            this.commentsRepository,
            {
                // 이거를 안해주면, 특정 포스트의 코멘트를 페이지네이트가 아닌, 모든 포스트의 모든 커멘트들을 페이지네이트하게됨.
                where: {
                    post: {
                        id: postId,
                    },
                },
                ...DEFAULT_COMMENT_FIND_OPTIONS,
            },
            `posts/${postId}/comments`,
        );
    }

    async getCommentById(id: number) {
        const comment = await this.commentsRepository.findOne({
            where: {
                id,
            },
            ...DEFAULT_COMMENT_FIND_OPTIONS,
        });

        if (!comment) {
            throw new BadRequestException(`id: ${id} Comment는 존재하지 않습니다.`);
        }

        return comment;
    }

    async createComment(dto: CreateCommentsDto, postId: number, author: UsersModel) {
        return this.commentsRepository.save({
            ...dto,
            post: {
                id: postId,
            },
            author,
        });
    }
}
