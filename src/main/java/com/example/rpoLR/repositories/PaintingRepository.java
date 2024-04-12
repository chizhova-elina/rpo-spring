package com.example.rpoLR.repositories;

import com.example.rpoLR.models.Painting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaintingRepository  extends JpaRepository<Painting, Long>
{

}

