import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponseDTO {
  @ApiProperty({ description: '댓글 알림 메시지' })
  message: string;

  @ApiProperty({ description: '게시글 ID' })
  board_id: number;

  @ApiProperty({ description: '노드 ID' })
  node_id: number;

  @ApiProperty({ description: '알림 ID' })
  notification_id: number;

  constructor(
    message: string,
    board_id: number,
    node_id: number,
    notification_id: number,
  ) {
    this.message = message;
    this.board_id = board_id;
    this.node_id = node_id;
    this.notification_id = notification_id;
  }
}
