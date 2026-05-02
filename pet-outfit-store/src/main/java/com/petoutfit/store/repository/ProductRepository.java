package com.petoutfit.store.repository;

import com.petoutfit.store.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByAnimalTypeIgnoreCase(String animalType);
    List<Product> findByFeaturedTrue();
    List<Product> findByCategoryId(Long categoryId);
}