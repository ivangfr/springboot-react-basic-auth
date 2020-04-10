package com.mycompany.bookapi.security;

import com.mycompany.bookapi.model.User;
import com.mycompany.bookapi.service.UserService;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.List;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public WebSecurityConfig(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService()).passwordEncoder(passwordEncoder);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers(HttpMethod.DELETE, "/api/books/**").hasAuthority(ADMIN)
                .antMatchers(HttpMethod.POST, "/api/books").hasAuthority(ADMIN)
                .antMatchers( "/api/books", "/api/books/**").hasAnyAuthority(ADMIN, USER)
                .antMatchers("/api/users", "/api/users/**").hasAuthority(ADMIN)
                .antMatchers("/public/**").permitAll()
                .and()
                .httpBasic();
        http.authorizeRequests()
                .antMatchers("/swagger-ui.html")
                .hasAnyAuthority(ADMIN, USER)
                .and()
                .formLogin();
        http.csrf().disable();
    }

    @Override
    public UserDetailsService userDetailsService() {
        return username -> {
            User user = userService.getUserByUsername(username).orElseThrow(() -> new UsernameNotFoundException(String.format("Username %s not found", username)));
            List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(user.getRole()));
            return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), authorities);
        };
    }

    public static final String ADMIN = "ADMIN";
    public static final String USER = "USER";

}
