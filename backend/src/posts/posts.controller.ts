import { Body, Controller, Delete, Get, Param, Post, Put, Req, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PostsEntity } from './posts.entity';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) {}

    // Get all posts
    // Permission: user or mod
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(): Promise<PostsEntity[]> {
        return this.postsService.findAll();
    }
    
    // Get one post, by postId
    // Permission: user or mod
    @UseGuards(JwtAuthGuard)
    @Get('findbyid/:id')
    async findOne(@Param('id') id: string): Promise<PostsEntity> {
        return this.postsService.findOne(id);
    }

    // Create a post
    // Permission: user or mod
    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(@Request() req, @Body() postsData): Promise<PostsEntity> {
        // Get username using token
        postsData.username = req.user.username;
        return this.postsService.create(postsData);
    }

    // Update a post, by postId
    // Permission: 
    // Users can only edit own's post,
    // while mods can edit anyone's
    @UseGuards(JwtAuthGuard)
    @Put('update')
    async update(@Request() req, @Body() postsData): Promise<UpdateResult> {
        // Can update only if the sender is a mod
        // Or is an owner of the post
        // Otherwise throw 401
        const hasValidOwner = await this.postsService.isOwnedBy(postsData.postId, req.user.username);
        if(!req.user.isModerator && !hasValidOwner) {
            throw new UnauthorizedException();
        }
        
        postsData.username = (await this.postsService.findOne(postsData.postId)).username;
        return this.postsService.update(postsData);
    }

    // Delete a post, by postId
    // Permission: 
    // Users can only delete own's post,
    // while mods can delete anyone's
    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    async delete(@Request() req, @Param('id') id): Promise<DeleteResult> {

        // Can delete only if the sender is a mod
        // Or is an owner of the post
        // Otherwise throw 401

        const hasValidOwner = await this.postsService.isOwnedBy(id, req.user.username)
        if(!req.user.isModerator && !hasValidOwner) {
            throw new UnauthorizedException();
        }

        return this.postsService.delete(id);
    }
}
