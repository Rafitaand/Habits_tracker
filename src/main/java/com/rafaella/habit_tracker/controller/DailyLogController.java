package com.rafaella.habit_tracker.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.rafaella.habit_tracker.model.DailyLog;
import com.rafaella.habit_tracker.service.DailyLogService;

@RestController
@RequestMapping("/daily-logs")
public class DailyLogController {

    private final DailyLogService dailyLogService;

    public DailyLogController(DailyLogService dailyLogService) {
        this.dailyLogService = dailyLogService;
    }

    @GetMapping
    public List<DailyLog> findAll() {
        return dailyLogService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DailyLog create(@RequestBody DailyLog dailyLog) {
        return dailyLogService.save(dailyLog);
    }

    @PutMapping("/{id}")
    public DailyLog update(@PathVariable Long id, @RequestBody DailyLog dailyLog) {
        dailyLogService.findById(id);
        dailyLog.setId(id);
        return dailyLogService.save(dailyLog);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        dailyLogService.delete(id);
    }
}
