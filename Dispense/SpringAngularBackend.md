# Guida: Collegare Angular 20 con Spring Boot

Questa guida mostra come integrare un frontend Angular 20 standalone con un backend Spring Boot, creando un'applicazione web completa con operazioni CRUD.

## 🎯 Panoramica dell'Architettura

```
Frontend (Angular 20)  ←→  Backend (Spring Boot)  ←→  Database (MySQL/H2)
   - HttpClient             - REST Controllers        - JPA/Hibernate
   - Standalone Components  - Service Layer           - Repository Pattern
   - RxJS Observables      - CORS Configuration
```

## 🚀 Configurazione Backend Spring Boot

### 1. Creazione del Progetto Spring Boot

Vai su [Spring Initializr](https://start.spring.io/) e configura:

- **Project**: Maven
- **Language**: Java
- **Spring Boot**: 3.2.x
- **Packaging**: Jar
- **Java**: 17 o 21

**Dipendenze necessarie**:

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <scope>runtime</scope>
    </dependency>
    <!-- Per sviluppo con H2 in-memory -->
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

### 2. Configurazione Application Properties

**Per MySQL** (`application.properties`):

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/angular_spring_db
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Server Configuration
server.port=8080

# CORS Configuration (alternativa)
cors.allowed-origins=http://localhost:4200
```

**Per H2 Database** (sviluppo rapido):

```properties
# H2 Database (in-memory per sviluppo)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# H2 Console (per debug)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA Configuration
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
```

### 3. Configurazione CORS

Crea una classe di configurazione per gestire CORS:

```java
package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## 📋 Esempio Completo: Sistema Gestione Utenti

### 1. Entity User

```java
package com.example.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Il nome è obbligatorio")
    @Column(nullable = false)
    private String name;
    
    @Email(message = "Email non valida")
    @NotBlank(message = "L'email è obbligatoria")
    @Column(nullable = false, unique = true)
    private String email;
    
    // Costruttori
    public User() {}
    
    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }
    
    // Getter e Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
```

### 2. Repository Interface

```java
package com.example.repository;

import com.example.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Metodi di query automatici di Spring Data JPA
    Optional<User> findByEmail(String email);
    
    List<User> findByNameContainingIgnoreCase(String name);
    
    // Query personalizzata
    @Query("SELECT u FROM User u WHERE u.name LIKE %:keyword% OR u.email LIKE %:keyword%")
    List<User> searchUsers(@Param("keyword") String keyword);
}
```

### 3. Service Layer

```java
package com.example.service;

import com.example.entity.User;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public User createUser(User user) {
        // Validazione business logic
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email già esistente: " + user.getEmail());
        }
        return userRepository.save(user);
    }
    
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utente non trovato con id: " + id));
        
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utente non trovato con id: " + id));
        userRepository.delete(user);
    }
    
    public List<User> searchUsers(String keyword) {
        return userRepository.searchUsers(keyword);
    }
}
```

### 4. REST Controller

```java
package com.example.controller;

import com.example.entity.User;
import com.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    // GET /api/users - Recupera tutti gli utenti
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // GET /api/users/{id} - Recupera utente per ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.notFound().build());
    }
    
    // POST /api/users - Crea nuovo utente
    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        try {
            User savedUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    // PUT /api/users/{id} - Aggiorna utente
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // DELETE /api/users/{id} - Elimina utente
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // GET /api/users/search?keyword=... - Cerca utenti
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String keyword) {
        List<User> users = userService.searchUsers(keyword);
        return ResponseEntity.ok(users);
    }
}
```

### 5. Gestione Globale degli Errori

```java
package com.example.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }
}
```

## 🔧 Aggiornamento del Frontend Angular

### 1. Aggiorna il User Service per Long ID

```typescript
// user.model.ts
export interface User {
  id: number; // Spring Boot usa Long, ma in TypeScript rimane number
  name: string;
  email: string;
}
```

### 2. Service Angular aggiornato

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/users';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError(err => {
        console.error('Errore recupero utenti', err);
        return throwError(() => new Error('Errore nel recupero degli utenti.'));
      })
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        console.error('Errore recupero utente', err);
        return throwError(() => new Error('Utente non trovato.'));
      })
    );
  }

  addUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      catchError(err => {
        console.error('Errore inserimento utente', err);
        return throwError(() => new Error('Errore nell\'inserimento dell\'utente.'));
      })
    );
  }

  updateUser(id: number, user: Omit<User, 'id'>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      catchError(err => {
        console.error('Errore aggiornamento utente', err);
        return throwError(() => new Error('Errore nell\'aggiornamento dell\'utente.'));
      })
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        console.error('Errore eliminazione utente', err);
        return throwError(() => new Error('Errore nell\'eliminazione dell\'utente.'));
      })
    );
  }

  searchUsers(keyword: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/search?keyword=${keyword}`).pipe(
      catchError(err => {
        console.error('Errore ricerca utenti', err);
        return throwError(() => new Error('Errore nella ricerca degli utenti.'));
      })
    );
  }
}
```

### Omit Type Utility

- `Omit<User, 'id'>`: Type utility che esclude il campo 'id' (generato dal backend)

## 🗄️ Setup Database MySQL

### 1. Crea il Database

```sql
CREATE DATABASE angular_spring_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE angular_spring_db;

-- La tabella users verrà creata automaticamente da Hibernate
-- Ma puoi crearla manualmente se preferisci:
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserisci dati di test
INSERT INTO users (name, email) VALUES 
('Mario Rossi', 'mario.rossi@email.com'),
('Giulia Bianchi', 'giulia.bianchi@email.com'),
('Luca Verdi', 'luca.verdi@email.com');
```

## 🚀 Avvio dell'Applicazione

### 1. Avvia Spring Boot

```bash
# Dalla cartella del progetto Spring Boot
./mvnw spring-boot:run

# Oppure se hai Maven installato globalmente
mvn spring-boot:run
```

### 2. Avvia Angular

```bash
# Dalla cartella del progetto Angular
ng serve
```

### 3. Test delle API

Puoi testare le API usando:

- **Browser**: `http://localhost:8080/api/users`
- **Postman** o **Insomnia**
- **H2 Console** (se usi H2): `http://localhost:8080/h2-console`

## 🔍 Troubleshooting Comune

### Errori CORS

```java
// Aggiungi al controller se necessario
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
```

### Errori di Connessione Database

```properties
# Verifica le credenziali in application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/angular_spring_db
spring.datasource.username=root
spring.datasource.password=yourpassword
```

### Errori di Validazione

```java
// Assicurati di avere la dipendenza per la validazione
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

## 📚 Vantaggi di Spring Boot vs Node.js

| Caratteristica | Spring Boot | Node.js |
|---|---|---|
| **Type Safety** | ✅ Java fortemente tipizzato | ⚠️ JavaScript/TypeScript |
| **Ecosystem** | ✅ Vasto ecosistema enterprise | ✅ NPM ricchissimo |
| **Performance** | ✅ JVM ottimizzata | ✅ V8 veloce per I/O |
| **Scalabilità** | ✅ Eccellente per enterprise | ✅ Ottimo per microservizi |
| **Learning Curve** | ⚠️ Più ripida | ✅ Più semplice |
| **Database ORM** | ✅ JPA/Hibernate maturo | ⚠️ Varie opzioni |

Questa configurazione ti fornisce una base solida per sviluppare applicazioni web complete con Angular e Spring Boot!
