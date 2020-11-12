import { Body, Controller, Delete, Get, Param, Post, Put, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CommentsEntity } from './comments.entity';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
    constructor(private commentsService: CommentsService) {}

    // Get all comments
    // This should not be available in release
    @Get()
    async findAll(): Promise<CommentsEntity[]> {
        return this.commentsService.findAll();
    }

    // Get one comment, by commentId
    // Permission: user or mod?
    // Not sure if this is needed at all
    @UseGuards(JwtAuthGuard)
    @Get('findbyid/:id')
    async findOne(@Param('id') id: string): Promise<CommentsEntity> {
        return this.commentsService.findOne(id);
    }

    // Get all comments of one post, by postId
    // Sorted by old to new
    // Permission: user or mod
    @UseGuards(JwtAuthGuard)
    @Get('findbypostid/:postid')
    async findByPostId(@Param('postid') postId: string): Promise<CommentsEntity[]> {
        return this.commentsService.findByPostId(postId);
    }

    // Create a comment
    // Permission: user or mod
    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(@Request() req, @Body() commentsData): Promise<CommentsEntity> {
        // Get username using token
        commentsData.username = req.user.username;
        return this.commentsService.create(commentsData);
    }

    // Update a comment, by commentId
    // Permission:
    // Users can only edit own's comments,
    // while mods can edit anyone's
    @UseGuards(JwtAuthGuard)
    @Put('update')
    async update(@Request() req, @Body() commentsData): Promise<UpdateResult> {
        // Can update only if the sender is a mod
        // Or is the owner of the comment
        // Otherwise throw 401
        const hasValidOwner = await this.commentsService.isOwnedBy(commentsData.commentId, req.user.username)
        if(!req.user.isModerator && !hasValidOwner) {
            throw new UnauthorizedException();
        }

        commentsData.username = (await this.commentsService.findOne(commentsData.commentId)).username;
        return this.commentsService.update(commentsData);
    }

    // Delete a comment, by commentId
    // Permission:
    // Users can only delete own's comments,
    // while mods can delete anyone's
    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    async delete(@Request() req, @Param('id') id: string): Promise<DeleteResult> {
        // Can delete only if the sender is a mod
        // Or is the owner of the comment
        // Otherwise throw 401

        const hasValidOwner = await this.commentsService.isOwnedBy(id, req.user.username)
        if(!req.user.isModerator && !hasValidOwner) {
            throw new UnauthorizedException();
        }

        return this.commentsService.delete(id);
    }
}
