package com.example.rpoLR.repositories;

import com.example.rpoLR.models.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CountryRepository  extends JpaRepository<Country, Long>
{

}
