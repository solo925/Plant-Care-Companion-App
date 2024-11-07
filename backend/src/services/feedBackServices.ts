import { AppDataSource } from "../config/data-source";
import { Feedback } from "../models/FeedBack";
import PlantHealthLog from "../models/PlantHealth";

export class FeedbackService {
    static generateFeedback(healthLog: PlantHealthLog): Partial<Feedback>[] {
        const feedbacks: Partial<Feedback>[] = [];

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

    static async saveFeedbacks(healthLog: PlantHealthLog): Promise<Feedback[]> {

        const feedbacks = this.generateFeedback(healthLog);
        const feedbackRepository = AppDataSource.getRepository(Feedback);
        const savedFeedbacks = await feedbackRepository.save(feedbacks);

        return savedFeedbacks;
    }
}
