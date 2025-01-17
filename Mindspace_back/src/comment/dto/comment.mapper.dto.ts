import { Injectable } from '@nestjs/common';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CreateCommentDto } from './create-comment.dto';
import { Comment } from '../entities/comment.entity';
import { CommentResponseDto } from './comment-response.dto';
import { User } from '../../user/entities/user.entity';
import { Board } from '../../board/entities/board.entity';

@Injectable()
export class CommentMapper {
  DtoToEntity(
    createCommentDto: CreateCommentDto,
    user: User,
    board: Board,
    userNickname: string,
  ): Comment {
    const comment = new Comment();
    comment.content = createCommentDto.content;
    comment.user = user;
    comment.board = board;
    user.nickname = userNickname;
    return comment;
  }

  DtoFromEntity(comment: Comment) {
    return {
      id: comment.id,
      userNickname: comment.user.nickname,
      content: comment.content,
      updateAt: comment.updatedAt,
    };
  }

  static commentToResponseDto(
    comment: Comment,
    userId: string,
  ): CommentResponseDto {
    const isDeletedComment = comment.content === '삭제된 댓글입니다.';
    return {
      id: comment.id,
      userNickname: comment.user.nickname,
      content: comment.content,
      updatedAt: formatDistanceToNow(comment.updatedAt, {
        addSuffix: true,
        locale: ko,
      }),
      editable: !isDeletedComment && comment.user.id.toString() === userId,
    };
  }
}
