import User from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import bookingService from './booking.service.js';

class UserService {

    async createUser({ name, email, password }) {
        try {
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                throw new Error('Email already exists');
            }
            console.log("Creating user");
            const user = new User({ name, email, password });
            return await user.save();
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id) {
        const foundUser = await User.findById(id);
        if(!foundUser) throw new ApiResponse(404, 'User not found');
        const { password, ...user} = foundUser;
        return user;
    }

    async getUserByEmail(email) {
        if (!email) throw new Error('Email is required');

        return await User.findByEmail(email);
    }

    async updateUser(id, updates) {
        try {
            const user = await User.findById(id);
            if (!user) {
                throw new Error('User not found');
            }

            Object.assign(user, updates);
            return await user.update();
        } catch (error) {
            throw error;
        }
    }


    async deleteUser(id) {
        try {
            const user = await User.findById(id);
            if (!user) {
                throw new ApiResponse(404,'User not found');
            } 
            return await user.delete();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves a paginated list of all users with optional filtering
     * @param {number} [page=1] - The page number for pagination
     * @param {number} [limit=20] - The number of records per page
     * @param {Object} [filters] - Optional filters for querying users
     * @param {string} [filters.name] - Filter users by name
     * @param {string} [filters.email] - Filter users by email
     * @param {boolean} [filters.is_verified] - Filter users by verification
     * @param {Date} [filters.start_date] - Filter users by start date
     * @param {Date} [filters.end_date] - Filter users by end date
     * @returns {Promise<Array<User>>} A promise that resolves to an array of user objects
     * @throws {Error} If there is an error retrieving the users
     */
    async getAllUsers(page =1, limit=20,filters) {
        return await User.findAll(page,limit,filters);
    }

    async getUserEvents(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            return await user.getEvents();
        } catch (error) {
            throw error;
        }
    }

    async getUserCount(){
        try {
            return await User.count();
        } catch (error) {
            logger.error("Error getting user count", error);
            throw new Error('Error fetching user count');
        }
    }

    async isUserBookingEvent(eventId,userId) {
        try {
            const booking = await bookingService.findByEventAndUser(eventId, userId);
            
            if (!booking) {
                return false;
            }

            return true;
        } catch (error) {
            return false;
        }
    }

}

const userService = new UserService();

export default userService;