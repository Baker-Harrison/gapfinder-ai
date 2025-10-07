use crate::models::{Attempt, ReviewState};

pub struct FSRSParameters {
    pub w: [f64; 17],
    pub request_retention: f64,
    pub maximum_interval: i32,
}

impl Default for FSRSParameters {
    fn default() -> Self {
        Self {
            w: [
                0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05, 0.34,
                1.26, 0.29, 2.61,
            ],
            request_retention: 0.9,
            maximum_interval: 36500,
        }
    }
}

pub struct FSRSScheduler {
    params: FSRSParameters,
}

impl Default for FSRSScheduler {
    fn default() -> Self {
        Self {
            params: FSRSParameters::default(),
        }
    }
}

impl FSRSScheduler {
    pub fn new(params: FSRSParameters) -> Self {
        Self { params }
    }

    pub fn schedule(&self, attempt: &mut Attempt, rating: i32) {
        match attempt.review_state {
            ReviewState::New => {
                attempt.difficulty = self.init_difficulty(rating);
                attempt.stability = self.init_stability(rating);
                attempt.review_state = if rating == 1 {
                    ReviewState::Learning
                } else {
                    ReviewState::Review
                };
            }
            ReviewState::Learning | ReviewState::Relearning => {
                let last_d = attempt.difficulty;
                let last_s = attempt.stability;
                attempt.difficulty = self.next_difficulty(last_d, rating);
                attempt.stability = self.short_term_stability(last_s, rating);
                attempt.review_state = if rating > 1 {
                    ReviewState::Review
                } else {
                    ReviewState::Relearning
                };
            }
            ReviewState::Review => {
                let last_d = attempt.difficulty;
                let last_s = attempt.stability;
                let retrievability = self.forgetting_curve(attempt.elapsed_days, last_s);
                attempt.difficulty = self.next_difficulty(last_d, rating);
                attempt.stability = self.next_recall_stability(last_d, last_s, retrievability, rating);
                attempt.review_state = if rating == 1 {
                    ReviewState::Relearning
                } else {
                    ReviewState::Review
                };
            }
        }

        attempt.scheduled_days = self.next_interval(attempt.stability);
    }

    fn init_stability(&self, rating: i32) -> f64 {
        self.params.w[(rating - 1) as usize].max(0.1)
    }

    fn init_difficulty(&self, rating: i32) -> f64 {
        let d = self.params.w[4] - self.params.w[5] * ((rating - 3) as f64);
        self.constrain_difficulty(d)
    }

    fn forgetting_curve(&self, elapsed_days: i32, stability: f64) -> f64 {
        (1.0 + elapsed_days as f64 / (9.0 * stability)).powf(-1.0).max(0.01)
    }

    fn next_interval(&self, stability: f64) -> i32 {
        let interval = (stability / self.params.w[16]
            * ((self.params.request_retention).ln() / (-0.5f64).ln() - 1.0))
            .round() as i32;
        interval.clamp(1, self.params.maximum_interval)
    }

    fn next_difficulty(&self, difficulty: f64, rating: i32) -> f64 {
        let next_d = difficulty - self.params.w[6] * ((rating - 3) as f64);
        self.constrain_difficulty(self.mean_reversion(self.params.w[4], next_d))
    }

    fn constrain_difficulty(&self, difficulty: f64) -> f64 {
        difficulty.clamp(1.0, 10.0)
    }

    fn mean_reversion(&self, init: f64, current: f64) -> f64 {
        self.params.w[7] * init + (1.0 - self.params.w[7]) * current
    }

    fn next_recall_stability(
        &self,
        difficulty: f64,
        stability: f64,
        retrievability: f64,
        rating: i32,
    ) -> f64 {
        let hard_penalty = if rating == 2 { self.params.w[15] } else { 1.0 };
        let easy_bonus = if rating == 4 { self.params.w[16] } else { 1.0 };

        stability
            * (1.0
                + (-stability).exp() * self.params.w[8]
                + (11.0 - difficulty) * self.params.w[9]
                + retrievability * self.params.w[10])
            * hard_penalty
            * easy_bonus
    }

    fn short_term_stability(&self, last_s: f64, rating: i32) -> f64 {
        last_s * (1.0 + self.params.w[11] * ((rating - 2) as f64))
    }

    pub fn calculate_mastery(&self, attempts: &[Attempt]) -> f64 {
        if attempts.is_empty() {
            return 0.0;
        }

        let total = attempts.len() as f64;
        let correct = attempts.iter().filter(|a| a.is_correct).count() as f64;
        let accuracy = (correct / total) * 100.0;

        let avg_stability = attempts.iter().map(|a| a.stability).sum::<f64>() / total;

        let brier_score = self.calculate_brier_score(attempts);
        let calibration_factor = (1.0 - brier_score).max(0.0);

        let recent_weight = 1.5;
        let recent_attempts = attempts.iter().take(5);
        let recent_accuracy =
            recent_attempts.clone().filter(|a| a.is_correct).count() as f64 / recent_attempts.count().max(1) as f64;

        let base_score = accuracy * 0.6 + (avg_stability / 100.0) * 20.0;
        let calibrated_score = base_score * (0.7 + calibration_factor * 0.3);
        let final_score = calibrated_score * 0.7 + recent_accuracy * 100.0 * recent_weight * 0.3;

        final_score.min(100.0)
    }

    pub fn calculate_brier_score(&self, attempts: &[Attempt]) -> f64 {
        if attempts.is_empty() {
            return 0.5;
        }

        let total = attempts.len() as f64;
        let sum: f64 = attempts
            .iter()
            .map(|a| {
                let confidence_prob = a.confidence as f64 / 5.0;
                let actual = if a.is_correct { 1.0 } else { 0.0 };
                (confidence_prob - actual).powi(2)
            })
            .sum();

        sum / total
    }
}
