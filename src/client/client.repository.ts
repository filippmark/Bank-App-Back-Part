import { EntityRepository, Repository } from 'typeorm';
import { Client } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Client)
export class ClientRepository extends Repository<Client> {
  public async createClient(createClientDto: CreateClientDto) {
    try {
      const client = this.create({
        ...createClientDto,
        monthlyIncome: createClientDto.monthlyIncome * 100,
      });

      let savedClient = null;

      savedClient = await this.save(client);

      return {
        ...savedClient,
        monthlyIncome: savedClient.monthlyIncome / 100,
      };
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException([e.detail]);
    }
  }

  public async updateClient(id: string, createClientDto: CreateClientDto) {
    const updateClientQuery = this.createQueryBuilder('client')
      .update()
      .set({
        ...createClientDto,
        monthlyIncome: createClientDto.monthlyIncome * 100,
      })
      .where('id = :id', { id })
      .returning('*');
    try {
      const result = await updateClientQuery.execute();
      return {
        ...result.raw[0],
        monthlyIncome: result.raw[0].monthlyIncome / 100,
      };
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException([e.detail]);
    }
  }
}
