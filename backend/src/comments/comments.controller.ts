import { Body, Controller, Delete, Get, Param, Post, Put, Req, Request } from '@nestjs/common';
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
    @Get('findbyid/:id')
    async findOne(@Param('id') id: string): Promise<CommentsEntity> {
        return this.commentsService.findOne(id);
    }

    // Get all comments of one post, by postId
    // Permission: user or mod
    @Get('findbypostid/:id')
    async findByPostId(@Param('postId') postId: string): Promise<CommentsEntity[]> {
        const allPosts = await this.commentsService.findAll();
        // Do something
        return allPosts; // Change to something else later
    }

    // Create a comment
    // Permission: user or mod
    @Post('create')
    async create(@Request() req, @Body() commentsData): Promise<CommentsEntity> {
        // To be implemented
        return this.commentsService.create(commentsData);
    }

    // Update a comment, by commentId
    // Permission:
    // Users can only edit own's comments,
    // while mods can edit anyone's
    @Put('update')
    async update(@Request() req, @Body() commentsData): Promise<UpdateResult> {
        // To be implemented
        return this.commentsService.update(commentsData);
    }

    // Delete a comment, by commentId
    // Permission:
    // Users can only delete own's comments,
    // while mods can delete anyone's
    @Delete('delete/:id')
    async delete(@Request() req, @Param('id') id: string): Promise<DeleteResult> {
        // To be implemented
        return this.commentsService.delete(id);
    }
}
