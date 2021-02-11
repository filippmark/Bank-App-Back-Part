import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientRepository } from './client.repository';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientRepository)
    private readonly clientRepository: ClientRepository,
  ) {}

  public async createClient(createClientDto: CreateClientDto) {
    return await this.clientRepository.createClient(createClientDto);
  }

  public async getClientById(id: string) {
    let client = null;
    try {
      client = await this.clientRepository.findOne({
        where: {
          id,
        },
      });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
    if (client) {
      return {
        ...client,
        monthlyIncome: client.monthlyIncome / 100,
      };
    } else {
      throw new NotFoundException('client with such id not found');
    }
  }

  public async updateClient(id: string, createClientDto: CreateClientDto) {
    return await this.clientRepository.updateClient(id, createClientDto);
  }

  public async getAllClients() {
    try {
      return await this.clientRepository.find({
        order: {
          surname: 'ASC',
        },
      });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  public async deleteClient(id: string) {
    try {
      return await this.clientRepository.delete({ id });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
