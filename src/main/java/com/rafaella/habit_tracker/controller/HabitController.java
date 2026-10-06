package com.rafaella.habit_tracker.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.rafaella.habit_tracker.model.Habit;
import com.rafaella.habit_tracker.service.HabitService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/habits")

public class HabitController {

    private final HabitService habitService;

    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    @GetMapping
    public List<Habit> findAll() {
        return habitService.findAll();
    }

    @GetMapping("/{id}")
    public Habit findById(@PathVariable Long id) {
        return habitService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Habit create(@RequestBody Habit habit) {
        return habitService.save(habit);
    }

    @PutMapping("/{id}")
    public Habit update(@PathVariable Long id, @RequestBody Habit habit) {
        habitService.findById(id);
        habit.setId(id);
        return habitService.save(habit);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        habitService.delete(id);
    }
}