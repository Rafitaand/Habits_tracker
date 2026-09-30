package com.rafaella.habit_tracker.repository;

import java.time.LocalDate;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.rafaella.habit_tracker.model.DailyLog;

public interface DailyLogRepository extends JpaRepository<DailyLog, Long> {
    Optional<DailyLog> findByHabitIdAndDate(Long habitId, LocalDate date);
}