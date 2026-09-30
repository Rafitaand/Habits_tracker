package com.rafaella.habit_tracker.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.rafaella.habit_tracker.repository.DailyLogRepository;

import jakarta.persistence.EntityNotFoundException;

import com.rafaella.habit_tracker.model.DailyLog;

@Service
public class DailyLogService {

    private final DailyLogRepository dailyLogRepository;

    public DailyLogService(DailyLogRepository dailyLogRepository) {
        this.dailyLogRepository = dailyLogRepository;
    }

    public List<DailyLog> findAll() {
        return dailyLogRepository.findAll();
    }

    public DailyLog findById(Long id) {
        return dailyLogRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Registro não encontrado"));
    }

    public DailyLog save(DailyLog dailyLog) {
        Optional<DailyLog> existente = dailyLogRepository.findByHabitIdAndDate(
                dailyLog.getHabit().getId(),
                dailyLog.getDate());

        if (existente.isPresent()) {
            throw new IllegalStateException("Já existe um registro para este hábito nesta data");
        }

        return dailyLogRepository.save(dailyLog);
    }

    public void delete(Long id) {
        dailyLogRepository.deleteById(id);
    }
}
