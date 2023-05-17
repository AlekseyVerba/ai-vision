import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

//SEQUELIZE
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';

//DTO
import { CreateAiDto } from './dto/create-ai.dto';
import { GetAisDto } from './dto/get-ais.dto';

//MODELS
import { Ai } from '../../models/ai.model';
import { AiExample } from '../../models/ai_example.model';
import { Category } from '../../models/category.model';

//SERVICES
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class AiService {
  constructor(
    private readonly utilsService: UtilsService,

    @InjectModel(Ai)
    private aiRepository: typeof Ai,

    @InjectModel(AiExample)
    private aiExampleRepository: typeof AiExample,

    @InjectModel(Category)
    private categoryRepository: typeof Category,
  ) {}

  async getAis({ limit, offset, category_id, search = '' }: GetAisDto) {
    const where: WhereOptions<Ai> = {
      name: {
        [Op.iLike]: `%${search}%`,
      },
    };

    if (category_id) {
      where.category_id = category_id;
    }

    return await this.aiRepository.findAll({
      where,
      order: [['name', 'ASC']],
      limit,
      offset,
    });
  }

  async getAi(id: string) {
    return await this.aiRepository.findByPk(id);
  }

  async getAiCategory(id: string) {
    return await this.categoryRepository.findOne({
      include: [
        {
          model: Ai,
          where: {
            id,
          },
          attributes: [],
        },
      ],
    });
  }

  async getAiExamples(id: string) {
    return await this.aiExampleRepository.findAll({
      where: {
        ai_id: id,
      },
    });
  }

  async createAi({ uid, examplesPath, ...dto }: CreateAiDto) {
    const transaction = await this.aiRepository.sequelize.transaction();

    try {
      const newAi = await this.aiRepository.create(dto, { transaction });

      if (examplesPath && examplesPath.length) {
        await this.aiExampleRepository.bulkCreate(
          examplesPath.map((examplePath) => ({
            value: examplePath,
            type: this.utilsService.getFileType(examplePath),
            ai_id: newAi.id,
          })),
          { transaction },
        );
      }

      await transaction.commit();

      return newAi;
    } catch (err) {
      transaction.rollback();
      console.log(err.message);
      throw new RpcException(err.message);
    }
  }
}
