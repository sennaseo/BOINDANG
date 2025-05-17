package com.d206.auth.exception;

public class BlackListedTokenException extends RuntimeException {
    public BlackListedTokenException(String message) {
        super(message);
    }
}