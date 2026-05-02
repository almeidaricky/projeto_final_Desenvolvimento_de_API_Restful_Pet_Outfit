package com.petoutfit.store.service;

import com.petoutfit.store.model.Category;
import com.petoutfit.store.model.Product;
import com.petoutfit.store.repository.CategoryRepository;
import com.petoutfit.store.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
    }

    public List<Product> findByAnimalType(String animalType) {
        return productRepository.findByAnimalTypeIgnoreCase(animalType);
    }

    public List<Product> findFeatured() {
        return productRepository.findByFeaturedTrue();
    }

    public Product save(Product product) {
        Category category = categoryRepository.findById(product.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        product.setCategory(category);
        return productRepository.save(product);
    }

    public Product update(Long id, Product productData) {
        Product product = findById(id);

        product.setName(productData.getName());
        product.setDescription(productData.getDescription());
        product.setAnimalType(productData.getAnimalType());
        product.setPrice(productData.getPrice());
        product.setStock(productData.getStock());
        product.setImageUrl(productData.getImageUrl());
        product.setFeatured(productData.getFeatured());
        product.setActive(productData.getActive());

        Category category = categoryRepository.findById(productData.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        product.setCategory(category);

        return productRepository.save(product);
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }
}