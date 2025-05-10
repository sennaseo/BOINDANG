package com.d206.auth.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

import com.d206.auth.security.JwtFilter;
import com.d206.auth.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
	private final JwtTokenProvider jwtTokenProvider;
	private final AuthenticationEntryPoint jwtAuthenticationEntryPoint;

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http , HandlerMappingIntrospector introspector) throws Exception {

		MvcRequestMatcher.Builder mvc = new MvcRequestMatcher.Builder(introspector);

		MvcRequestMatcher[] permitAllList = {
			mvc.pattern("/user/auth/login"), mvc.pattern("/user/signup"),
			mvc.pattern("/user/email-check/*"),mvc.pattern("/user/nickname-check/*")
		};

		MvcRequestMatcher[] swaggerPatterns = {
			mvc.pattern("/*/v3/api-docs"),
			mvc.pattern("/*/v3/api-docs/**"),
			mvc.pattern("/*/swagger-ui/**")
		};

		http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
			.httpBasic(AbstractHttpConfigurer::disable)
			.csrf(AbstractHttpConfigurer::disable)
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		http.addFilterBefore(new JwtFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration corsConfiguration = new CorsConfiguration();
		// Todo 추후 도메인으로 변경
		corsConfiguration.addAllowedOrigin("*");
		corsConfiguration.addAllowedHeader("*");
		corsConfiguration.setAllowedMethods(Arrays.asList(
			"GET","POST","DELETE","OPTIONS"
		));

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		//모든 요청 허용
		source.registerCorsConfiguration("/**", corsConfiguration);

		return source;
	}
}
