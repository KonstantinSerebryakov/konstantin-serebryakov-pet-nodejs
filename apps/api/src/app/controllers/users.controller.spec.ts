import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { IRMQServiceOptions, RMQModule, RMQService, RMQTestService } from 'nestjs-rmq';
import { ApiService } from '../services/api.service';
import { INestApplication, InternalServerErrorException } from '@nestjs/common';

describe('UsersController', () => {
	let app: INestApplication;
  let controller: UsersController;
  let rmqService: RMQTestService;
  let apiService: ApiService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
				RMQModule.forTest({}),
			],
      controllers: [UsersController],
      providers: [ApiService],
    }).compile();

    app = module.createNestApplication();
    await app.init()

    controller = module.get<UsersController>(UsersController);
    rmqService = module.get(RMQService);
    apiService = module.get<ApiService>(ApiService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserInfo', () => {
    it('should return user information', async () => {
      const mockUserId = '123';
      const mockRequestId = 'mockRequestId';
      const mockRespo nse = { data:"temp" };

      jest.spyOn(apiService, 'generateRequestId').mockResolvedValue(mockRequestId);
      jest.spyOn(rmqService, 'send').mockResolvedValue(mockResponse);

      // Call the getUserInfo method
      const result = await controller.getUserInfo(mockUserId);

      // Assertions
      expect(apiService.generateRequestId).toHaveBeenCalledWith('users');
      expect(rmqService.send).toHaveBeenCalledWith(
        expect.any(String), // Ensure the topic is being sent
        { userId: mockUserId },
        { headers: { requestId: mockRequestId } }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      // Mock the necessary functions to throw an error
      const mockUserId = '123';
      jest.spyOn(apiService, 'generateRequestId').mockRejectedValue(new Error('Test error'));

      // Assertions for error handling
      await expect(controller.getUserInfo(mockUserId)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
