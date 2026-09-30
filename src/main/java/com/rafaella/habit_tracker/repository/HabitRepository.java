package com.rafaella.habit_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.rafaella.habit_tracker.model.Habit;

public interface HabitRepository extends JpaRepository<Habit, Long> {
}