package com.rafaella.habit_tracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.rafaella.habit_tracker.model.Habit;
import com.rafaella.habit_tracker.repository.HabitRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class HabitService {

    private final HabitRepository habitRepository;

    public HabitService(HabitRepository habitRepository) {
        this.habitRepository = habitRepository;
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

    public void delete(Long id) {
        habitRepository.deleteById(id);
    }
}