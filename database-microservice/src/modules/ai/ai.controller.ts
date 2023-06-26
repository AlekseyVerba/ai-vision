import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

//SERVICES
import { AiService } from './ai.service';

//DTO
import { CreateAiDto } from './dto/create-ai.dto';
import { GetAisDto } from './dto/get-ais.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @MessagePattern('get-count-ais')
  async getCountAis() {
    return await this.aiService.getCountAis()
  }

  @MessagePattern('get-ais')
  async getAis(dto: GetAisDto) {
    return await this.aiService.getAis(dto);
  }

  @MessagePattern('get-ai')
  async getAi(id: string) {
    return await this.aiService.getAi(id);
  }

  @MessagePattern('get-ai-examples')
  async getAiExamples(id: string) {
    return await this.aiService.getAiExamples(id);
  }

  @MessagePattern('create-ai')
  async createAi(dto: CreateAiDto) {
    return await this.aiService.createAi(dto);
  }

  @MessagePattern('get-ai-category')
  async getAiCategory(id: string) {
    return await this.aiService.getAiCategory(id);
  }
}
