import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientRepository } from './client.repository';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientRepository)
    private readonly clientRepository,
  ) {}

  public createClient() {}
}
