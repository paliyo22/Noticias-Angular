import { CommonModule } from "@angular/common"
import { ChangeDetectionStrategy, Component, computed, effect, inject, Input, type OnInit } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { CommentService } from "../../service/comment.service"
import { AuthService } from "../../service/auth.service"

@Component({
  selector: "app-comment",
  imports: [FormsModule, CommonModule],
  templateUrl: "./comment.component.html",
  styleUrl: "./comment.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent implements OnInit {
  authService = inject(AuthService)
  commentService = inject(CommentService)

  @Input({ required: true }) newsId!: string

  newComment = ""
  replyText = ""
  editText = ""
  activeReplyForm: string | null = null
  activeEditForm: string | null = null
  expandedReplies = new Set<string>()

  commentState = computed(() => this.commentService.commentState())
  authState = computed(() => this.authService.authState())

  isLoggedIn = computed(() => this.authState().logged)
  currentUsername = computed(() => this.authState().username)

  ngOnInit(): void {
    this.commentService.getComments(this.newsId) 
  }

  onSubmitComment(): void {
    if (!this.newComment.trim() || !this.isLoggedIn()) return

    this.commentService.addComment(this.newsId, this.newComment.trim())
    this.newComment = ""
  }

  onSubmitReply(parentCommentId: string): void {
    if (!this.replyText.trim() || !this.isLoggedIn()) return

    this.commentService.addComment(this.newsId, this.replyText.trim(), parentCommentId)
    this.replyText = ""
    this.activeReplyForm = null
  }

  onSubmitEdit(commentId: string): void {
    if (!this.editText.trim() || !this.isLoggedIn()) return

    this.commentService.updateComment(this.newsId, commentId, this.editText.trim())
    this.editText = ""
    this.activeEditForm = null
  }

  toggleLike(commentId: string): void {
    if (!this.isLoggedIn()) return

    if (this.isLikedByCurrentUser(commentId)) {
      this.commentService.deleteLikes(commentId)
    } else {
      this.commentService.addLike(commentId)
    }
  }

  isLikedByCurrentUser(commentId: string): boolean {
    const currentUsername = this.currentUsername()
    const commentLikes = this.commentState().comment.likes.get(commentId) || []
    return currentUsername ? commentLikes.includes(currentUsername) : false
  }

  getLikesCount(commentId: string): number {
    const commentLikes = this.commentState().comment.likes.get(commentId) || []
    return commentLikes.length
  }

  isCommentOwner(commentUsername: string): boolean {
    return this.isLoggedIn() && commentUsername === this.currentUsername()
  }

  deleteComment(commentId: string, username: string): void {
    if (!this.isLoggedIn() || username !== this.currentUsername()) return

    this.commentService.deleteComment(this.newsId, commentId)
  }

  clearComment(): void {
    this.newComment = ""
  }

  toggleReplyForm(commentId: string): void {
    this.activeReplyForm = this.activeReplyForm === commentId ? null : commentId
    this.replyText = ""
    this.activeEditForm = null
  }

  toggleEditForm(commentId: string, currentContent: string): void {
    this.activeEditForm = this.activeEditForm === commentId ? null : commentId
    this.editText = currentContent
    this.activeReplyForm = null
  }

  cancelReply(): void {
    this.activeReplyForm = null
    this.replyText = ""
  }

  cancelEdit(): void {
    this.activeEditForm = null
    this.editText = ""
  }

  toggleReplies(commentId: string): void {
    if (this.expandedReplies.has(commentId)) {
      this.expandedReplies.delete(commentId)
    } else {
      this.expandedReplies.add(commentId)
      const commentData = this.commentState().comment.data.get(commentId)
      if (commentData && commentData.replies.length === 0 && commentData.comment.replies > 0) {
        this.commentService.getReplies(commentId)
      }
    }
  }

  retry(): void {
    if (this.newsId) {
      this.commentService.getComments(this.newsId)
      if (this.isLoggedIn()) {
        this.commentService.getLikes()
      }
    }
  }
}
