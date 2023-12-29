import { Injectable, UseFilters } from '@nestjs/common';
import { RoomFullException } from '../exceptions/RoomFullException';
import { RoomFullExceptionFilter } from '../exceptions/filters/RoomFullExceptionFilter';

// This is a fake database. In the real application, this would be connected to the actual database.
@Injectable()
export class DatabaseService {
  private users: { username: string | string[], socketId: string }[];

  constructor() {
    this.users = [];
  }

  @UseFilters(RoomFullExceptionFilter)
  addUser(user: { username: string | string[], socketId: string}) {
    if (this.users.find((u) => u.username === user.username)) {
      throw new Error('User already exists');
    }

    if (this.users.length >= 2) {
      throw new RoomFullException('Only two users are allowed');
    }

    this.users.push(user);
  }

  removeUser(username: string | string[]) {
    if (!this.users.find((u) => u.username === username)) {
      throw new Error('User does not exist');
    }

    this.users = this.users.filter((u) => u.username !== username);
  }

  getNumberOfUsers() {
    return this.users.length;
  }
}
