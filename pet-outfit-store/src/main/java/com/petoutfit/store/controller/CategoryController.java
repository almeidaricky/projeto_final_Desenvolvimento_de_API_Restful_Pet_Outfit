package com.petoutfit.store.controller;

import com.petoutfit.store.model.Category;
import com.petoutfit.store.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<Category> findAll() {
        return categoryService.findAll();
    }

    @PostMapping
    public Category create(@RequestBody Category category) {
        return categoryService.save(category);
    }
}