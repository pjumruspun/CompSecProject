import { Body, Controller, Get, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
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
    async create(@Request() req, @Body() postsData): Promise<any> {
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

    // Delete a post, by postId
    // Permission: 
    // Users can only edit own's post,
    // while mods can edit anyone's

}
