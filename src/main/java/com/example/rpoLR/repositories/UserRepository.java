package com.example.rpoLR.repositories;

import com.example.rpoLR.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository  extends JpaRepository<User, Long>
{
    Optional<User> findByToken(String token);
    Optional<User> findByLogin(String login);
}
