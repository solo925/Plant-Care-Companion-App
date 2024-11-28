"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackService = void 0;
const data_source_1 = require("../config/data-source");
const FeedBack_1 = require("../models/FeedBack");
class FeedbackService {
    static generateFeedback(healthLog) {
        const feedbacks = [];
        if (healthLog.leafColor === 'yellow') {
            feedbacks.push({
                message: 'Leaves turning yellow may indicate overwatering or nutrient deficiency.',
                healthLog: healthLog
            });
        }
        if (healthLog.moistureLevel !== undefined && !isNaN(Number(healthLog.moistureLevel)) && Number(healthLog.moistureLevel) < 30) {
            feedbacks.push({
                message: 'The soil moisture level is low. Consider watering your plant.',
                healthLog: healthLog
            });
        }
        if (healthLog.pestPresence) {
            feedbacks.push({
                message: 'Pests detected. Consider using an organic pesticide.',
                healthLog: healthLog
            });
        }
        return feedbacks;
    }
    static async saveFeedbacks(healthLog) {
        const feedbacks = this.generateFeedback(healthLog);
        const feedbackRepository = data_source_1.AppDataSource.getRepository(FeedBack_1.Feedback);
        const savedFeedbacks = await feedbackRepository.save(feedbacks);
        return savedFeedbacks;
    }
}
exports.FeedbackService = FeedbackService;
