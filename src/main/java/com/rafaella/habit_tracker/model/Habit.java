package com.rafaella.habit_tracker.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity // funciona para declarar as entidades necessárias ao projeto.
@Getter // anotação, por ter utilizado o lombok
@Setter // anotação, por ter utilizado o lombok
public class Habit {
    
    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY) //declarei responsabilidade do bd
    private Long id; //colocando Long por padrão de segurança

    private String name;
    private String category;
    private String reason;
    private String description;


    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }
    public String getReason() {
        return reason;
    }
    public void setReason(String reason) {
        this.reason = reason;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }


}
