import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id : id,
  }: IFindUserWithGamesDTO):  Promise<User | undefined>{
    const user = await this.repository.findOne({
      id,
    }, {
      relations: ["games"]
    })
    return user;

    
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {

    return await this.repository.query(
      "select "+
      "  users.id, "+
      "  users.first_name, "+
      "  users.last_name, "+
      "  users.email,"+
      "  users.created_at, "+
      "  users.updated_at "+
      "from users "+
      "order by users.first_name" 
    );
  
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return await this.repository.query(
      "select * from users  "+
      "where LOWER(users.first_name) like lower($1)  "+
      "and LOWER(users.last_name) like lower($2) ",
      [first_name, last_name]
    ); 
  }
  
}
