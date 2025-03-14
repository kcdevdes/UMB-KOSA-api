import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const mockUserRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const mockUser: User = {
      id: '1234-5678-91011',
      username: 'test_user',
      email: 'test@example.com',
      role: 'user',
      bio: 'Test bio',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: null,
      status: 'active',
      profileImageUrl: null,
      deletedAt: null,
    };

    userRepository.create = jest.fn().mockReturnValue(mockUser);
    userRepository.save = jest.fn().mockResolvedValue(mockUser);

    const result = await service.createUser(mockUser.username, mockUser.email);
    expect(result).toEqual(mockUser);
    expect(userRepository.create).toHaveBeenCalledWith({
      username: 'test_user',
      email: 'test@example.com',
    });
    expect(userRepository.save).toHaveBeenCalledWith(mockUser);
  });

  it('should return all users', async () => {
    const mockUsers = [
      {
        id: '1234',
        username: 'user1',
        email: 'user1@example.com',
      },
      {
        id: '5678',
        username: 'user2',
        email: 'user2@example.com',
      },
    ];

    userRepository.find = jest.fn().mockResolvedValue(mockUsers);

    const result = await service.findAll();
    expect(result).toEqual(mockUsers);
    expect(userRepository.find).toHaveBeenCalled();
  });

  it('should return one user by ID', async () => {
    const mockUser = {
      id: '1234',
      username: 'test_user',
      email: 'test@example.com',
    };

    userRepository.findOne = jest.fn().mockResolvedValue(mockUser);

    const result = await service.findOneById('1234');
    expect(result).toEqual(mockUser);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: '1234' },
    });
  });
});
