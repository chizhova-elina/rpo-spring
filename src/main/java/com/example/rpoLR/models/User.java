package com.example.rpoLR.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Класс, который использует пользователь
 * @author kostya
 */
@Entity
@Table(name = "users")
@Access(AccessType.FIELD)
public class User {
    // ID - первинчый ключ
    @Id
    @Column(name = "id", updatable = false, nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    // Поле логина. Имеет тип VARCHAR. Для нас это String
    @Column(name = "login", unique = true, nullable = false)
    public String login;

    // Ну всё-таки скрыть пароль надо бы)
    @JsonIgnore
    @Column(name = "password")
    public String password;

    @Transient
    public String np;

    // Поле - электронная почта
    @Column(name = "email")
    public String email;

    // Поле - соль
    @JsonIgnore
    @Column(name = "salt")
    public String salt;

    // Поле - токен

    @Column(name = "token")
    public String token;

    // Поле активности
    @Column(name = "activity")
    public LocalDateTime activity;

    @ManyToMany(mappedBy = "users")
    public Set<Museum> museums = new HashSet<>();

    public User() {}

    public User(Long id) {
        this.id = id;
    }


    public void removeMuseum(Museum m) {
        this.museums.remove(m);
        m.users.remove(this);
    }
}

