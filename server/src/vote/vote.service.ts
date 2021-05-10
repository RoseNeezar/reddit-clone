import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CommentsEntity from 'src/entities/comments/comments.entity';
import { CommentsRepository } from 'src/entities/comments/comments.repository';
import { PostRepository } from 'src/entities/post/post.repository';
import { SubRepository } from 'src/entities/sub/sub.repository';
import UserEntity from 'src/entities/user/user.entity';
import VotesEntity from 'src/entities/votes/votes.entity';
import { VotesRepository } from 'src/entities/votes/votes.repository';
import { VoteDto } from './vote.dto';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(CommentsRepository)
    private commentRepo: CommentsRepository,
    @InjectRepository(SubRepository) private subRepo: SubRepository,
    @InjectRepository(PostRepository) private postRepo: PostRepository,
    @InjectRepository(VotesRepository) private voteRepo: VotesRepository,
  ) {}

  async vote(voting: VoteDto, user: UserEntity) {
    const { identifier, slug, commentIdentifier, value } = voting;

    // Validate vote value
    if (![-1, 0, 1].includes(value)) {
      throw new ConflictException('Value must be -1, 0 or 1');
    }

    try {
      let post = await this.postRepo.findOneOrFail({ identifier, slug });
      let vote: VotesEntity | undefined;
      let comment: CommentsEntity | undefined;

      if (commentIdentifier) {
        // IF there is a comment identifier find vote by comment
        comment = await this.commentRepo.findOneOrFail({
          identifier: commentIdentifier,
        });
        vote = await this.voteRepo.findOne({ user, comment });
      } else {
        // Else find vote by post
        vote = await this.voteRepo.findOne({ user, post });
      }

      if (!vote && value === 0) {
        // if no vote and value = 0 return error
        throw new NotFoundException('Vote not found');
      } else if (!vote) {
        // If no vote create it
        vote = new VotesEntity({ user, value });

        if (comment) vote.comment = comment;
        else vote.post = post;
        await this.voteRepo.create(vote).save();
      } else if (value === 0) {
        // If vote exists and value = 0 remove vote from DB
        await vote.remove();
      } else if (vote.value !== value) {
        // If vote and value has changed, update vote
        vote.value = value;
        await vote.save();
      }

      post = await this.postRepo.findOneOrFail(
        { identifier, slug },
        { relations: ['comments', 'comments.votes', 'sub', 'votes'] },
      );
      post.setUserVote(user);
      post.comments.forEach((c) => c.setUserVote(user));

      return post;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
