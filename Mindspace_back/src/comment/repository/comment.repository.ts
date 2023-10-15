import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { buildPaginator } from 'typeorm-cursor-pagination';
import { PagingParams } from '../../global/common/type';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CustomCommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly CommentRepository: Repository<Comment>,
  ) {}

  async paginate(boardId: number, pagingParams?: PagingParams) {
    const queryBuilder = this.CommentRepository.createQueryBuilder('comment')
      .innerJoinAndSelect('comment.user', 'user')
      .where('comment.board_id = :boardId', { boardId })
      .andWhere('comment.parent_id IS NULL')
      .orderBy('comment.id', 'DESC');

    const paginator = buildPaginator({
      entity: Comment,
      paginationKeys: ['createdAt'],
      query: {
        limit: 10,
        order: 'DESC',
        afterCursor: pagingParams.afterCursor,
        beforeCursor: pagingParams.beforeCursor,
      },
    });

    const paginationResult = await paginator.paginate(queryBuilder);

    return {
      data: paginationResult.data,
      cursor: {
        count: paginationResult.data.length,
        ...paginationResult.cursor,
      },
    };
  }

  async findReplies(parentCommentId: number): Promise<Comment[]> {
    return this.CommentRepository.createQueryBuilder('comment')
      .innerJoinAndSelect('comment.user', 'user')
      .where('comment.parent_id = :parentCommentId', { parentCommentId })
      .orderBy('comment.id', 'DESC')
      .getMany();
  }
}
