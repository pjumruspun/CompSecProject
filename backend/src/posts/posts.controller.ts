import { Body, Controller, Get, Param, Post, Put, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostsEntity } from './posts.entity';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) {}

    // Get all posts
    // Permission: user or mod
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Request() req): Promise<PostsEntity[]> {
        return this.postsService.findAll();
    }
    
    // Get one post, by postId
    // Permission: user or mod

    // Create a post
    // Permission: user or mod
    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(@Request() req, @Body() postsData): Promise<PostsEntity> {
        // Checking if the token of the post publisher associates with
        // the username in the postsData form
        if(req.user.username !== postsData.username) {
            throw new UnauthorizedException();
        }

        return this.postsService.create(postsData);
    }

    // Update a post, by postId
    // Permission: 
    // Users can only edit own's post,
    // while mods can edit anyone's
    @UseGuards(JwtAuthGuard)
    @Put('update')
    async update(@Request() req, @Body() postsData): Promise<any> {
        // Can update only if the sender is a mod
        // Or is an owner of the post
        // Otherwise throw 401
        if(req.user.username !== postsData.username && !req.user.isModerator) {
            throw new UnauthorizedException();
        }
        
        return this.postsService.update(postsData);
    }

    // Delete a post, by postId
    // Permission: 
    // Users can only edit own's post,
    // while mods can edit anyone's

}
