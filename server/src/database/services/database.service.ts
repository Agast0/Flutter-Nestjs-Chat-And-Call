import { Injectable } from '@nestjs/common';
import { User } from '../../common/types/User.type';

// This is a fake database. In the real application, this would be connected to the actual database.
@Injectable()
export class DatabaseService {
  private users: User[];

  constructor() {
    this.users = [];
  }

  addUser(user: User): Error | void {
    if (this.users.find((u) => u.username === user.username)) {
      // Nestjs doesn't catch errors thrown in the handleConnection method of the gateway.
      // So, we need to return an error and handle accordingly rather than throwing it.
      return new Error('User already exists');
    }

    if (this.getNumberOfUsers() >= 2) {
      return new Error('Only two users are allowed');
    }

    this.users.push(user);
  }

  removeUser(username: string | string[]): Error | void {
    if (!this.users.find((u) => u.username === username)) {
      return new Error('User does not exist');
    }

    this.users = this.users.filter((u) => u.username !== username);
  }

  getUser(username: string | string[]): User | Error {
    const user = this.users.find((u) => u.username === username);
    if (!user) {
      return new Error('User does not exist');
    }

    return user;
  }

  getOtherUser(clientUsername: string | string[]): User | Error {
    const otherUser = this.users.find((u) => u.username !== clientUsername);
    if (!otherUser) {
      return new Error('Other user does not exist');
    } else {
      return otherUser;
    }
  }

  private getNumberOfUsers() {
    return this.users.length;
  }
}
