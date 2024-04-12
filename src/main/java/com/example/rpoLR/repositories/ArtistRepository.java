package com.example.rpoLR.repositories;


import com.example.rpoLR.models.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtistRepository  extends JpaRepository<Artist, Long>
{

}
