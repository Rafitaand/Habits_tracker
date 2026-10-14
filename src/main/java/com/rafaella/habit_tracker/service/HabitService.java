package com.rafaella.habit_tracker.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rafaella.habit_tracker.model.Habit;
import com.rafaella.habit_tracker.repository.DailyLogRepository;
import com.rafaella.habit_tracker.repository.HabitRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class HabitService {

    private final HabitRepository habitRepository;
    private final DailyLogRepository dailyLogRepository;

    public HabitService(HabitRepository habitRepository, DailyLogRepository dailyLogRepository) {
        this.habitRepository = habitRepository;
        this.dailyLogRepository = dailyLogRepository;
    }

    public List<Habit> findAll() {
        return habitRepository.findAll();
    }

    public Habit findById(Long id) {
        return habitRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Hábito não encontrado"));
    }

    public Habit save(Habit habit) {
        return habitRepository.save(habit);
    }

    @Transactional
    public void delete(Long id) {
        dailyLogRepository.deleteByHabitId(id);
        habitRepository.deleteById(id);
    }
}